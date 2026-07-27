const { Redis } = require('@upstash/redis');

// GET  /api/flow                    → devuelve el JSON del flujo
// POST /api/flow                    → guarda el JSON (requiere token admin)
// POST /api/flow/reset              → resetea al default (requiere token admin)
// GET  /api/flow/versions           → lista versiones guardadas
// POST /api/flow/versions           → guarda versión + publica (requiere token admin)
// POST /api/flow/versions/:n/restore → restaura versión N como flujo activo (requiere token admin)
// DELETE /api/flow/versions/:n      → elimina snapshot de versión (requiere token admin)

const kv = Redis.fromEnv();

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = req.url || '';

  // ── VERSIONES ─────────────────────────────────────────────────
  const vMatch = url.match(/\/versions(?:\/(\d+)(?:\/(restore))?)?(?:\?.*)?$/);
  if (vMatch) {
    const vNum = vMatch[1] ? parseInt(vMatch[1]) : null;
    const action = vMatch[2];

    if (req.method === 'GET') {
      if (vNum === null) {
        const versions = await kv.get('igm_flow_versions') || [];
        return res.status(200).json(versions);
      }
      const data = await kv.get(`igm_flow_v${vNum}`);
      if (!data) return res.status(404).json({ error: 'Versión no encontrada.' });
      return res.status(200).json(data);
    }

    const token = req.headers['x-admin-token'];
    if (!token || token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ error: 'Token inválido o ausente.' });
    }

    if (req.method === 'POST') {
      if (vNum === null) {
        const body = req.body;
        if (!body || typeof body.flow !== 'object') {
          return res.status(400).json({ error: 'Se requiere {flow, label}.' });
        }
        const versions = await kv.get('igm_flow_versions') || [];
        const n = versions.length ? Math.max(...versions.map(v => v.n)) + 1 : 1;
        const meta = { n, label: body.label || '', savedAt: new Date().toISOString() };
        versions.push(meta);
        await kv.set(`igm_flow_v${n}`, body.flow);
        await kv.set('igm_flow_versions', versions);
        await kv.set('igm_flow', body.flow);
        return res.status(200).json({ ok: true, version: meta });
      }
      if (action === 'restore') {
        const data = await kv.get(`igm_flow_v${vNum}`);
        if (!data) return res.status(404).json({ error: 'Versión no encontrada.' });
        await kv.set('igm_flow', data);
        return res.status(200).json({ ok: true, flow: data });
      }
    }

    if (req.method === 'DELETE' && vNum !== null && !action) {
      const versions = await kv.get('igm_flow_versions') || [];
      await kv.set('igm_flow_versions', versions.filter(v => v.n !== vNum));
      await kv.del(`igm_flow_v${vNum}`);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Método no permitido.' });
  }

  // ── GET: retorna flujo actual ──────────────────────────────────
  if (req.method === 'GET') {
    const data = await kv.get('igm_flow');
    if (!data) {
      await kv.set('igm_flow', DEFAULT_FLOW);
      return res.status(200).json(DEFAULT_FLOW);
    }
    return res.status(200).json(data);
  }

  // ── POST: guardar flujo o resetear ────────────────────────────
  if (req.method === 'POST') {
    const token = req.headers['x-admin-token'];
    if (!token || token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ error: 'Token inválido o ausente.' });
    }

    if (url.endsWith('/reset')) {
      await kv.set('igm_flow', DEFAULT_FLOW);
      return res.status(200).json({ ok: true, message: 'Flujo reseteado al original.' });
    }

    const body = req.body;
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Body inválido. Se espera un objeto JSON.' });
    }
    await kv.set('igm_flow', body);
    return res.status(200).json({ ok: true, message: 'Flujo guardado.' });
  }

  return res.status(405).json({ error: 'Método no permitido.' });
}

// ── Flujo por defecto (fallback si KV está vacío) ─────────────
const L = (url) => `<a href="${url}" target="_blank">${url}</a>`;

function agentSubflow(dept, cat, idPrefix) {
  const deptName = { pasaportes:"Pasaportes", extranjeria:"Extranjería", control:"Control Migratorio", info:"Información General" }[cat];
  const deptCat = `agente-${cat}`;
  return {
    id:`${idPrefix}`, label:`🧑‍💼 Hablar con un agente de ${deptName}`, type:"menu", cat,
    intents:["agente","hablar con alguien","persona","quiero hablar con un agente"],
    detail:`Con mucho gusto le ayudo a conectarle con un agente especializado en ${deptName}. Permítame un momento para verificar la disponibilidad. 🔄`,
    children:[{
      id:`${idPrefix}.1`, label:"✅ Verificar horario de atención", type:"check", cat:deptCat, intents:[],
      detail:`<span class="flow-step">⚙️ Paso 1 de 3 — Verificación de horario</span>\n\nEl bot verifica automáticamente la hora actual del sistema.\n\n📅 Horario de atención del área de ${deptName}:\nLunes a viernes de 7:00 a 13:00 horas y de 14:00 a 15:00 horas\n\nSi la consulta se realiza dentro del horario → continúa al Paso 2.\nSi está fuera del horario → ramifica a nodo fuera de horario.`,
      children:[
        { id:`${idPrefix}.1.1`, label:"⏰ Fuera de horario de atención", type:"offline", cat:deptCat, intents:[],
          detail:`Lamentablemente en este momento nuestras oficinas se encuentran cerradas. 😔\n\nNuestro horario de atención en ${deptName} es:\n📅 Lunes a viernes de 7:00 a 13:00 horas y de 14:00 a 15:00 horas\n\nPuede intentar nuevamente durante ese horario o utilizar las siguientes opciones de autoservicio:\n🔗 Portal web del IGM: https://igm.gob.gt\n📞 WhatsApp informativo: 3757-0902\n\n¿Desea que le envíe un resumen de la información que necesita? (1. Sí / 2. No, gracias)` },
        { id:`${idPrefix}.1.2`, label:"🟢 Dentro de horario → Verificar disponibilidad", type:"check", cat:deptCat, intents:[],
          detail:`<span class="flow-step">⚙️ Paso 2 de 3 — Verificación de agentes disponibles</span>\n\nEl bot consulta en tiempo real la cola de agentes asignados al área de ${deptName}.\n\nSi hay agentes disponibles → continúa al Paso 3.\nSi no hay agentes disponibles → informa al usuario.`,
          children:[
            { id:`${idPrefix}.1.2.1`, label:"🔴 Sin agentes disponibles", type:"offline", cat:deptCat, intents:[],
              detail:`Nuestros agentes de ${deptName} se encuentran atendiendo otras consultas en este momento. 😓\n\nTiene las siguientes opciones:\n1️⃣ Esperar en línea — Le avisaremos cuando un agente esté disponible.\n2️⃣ Dejarnos su nombre y pregunta — Un agente le contactará a la brevedad.\n3️⃣ Consultar nuestro portal de autoservicio — 🔗 https://igm.gob.gt\n\n¿Cuál prefiere?` },
            { id:`${idPrefix}.1.2.2`, label:"🟢 Agente disponible → Transferir", type:"transfer", cat:deptCat, intents:[],
              detail:`<span class="flow-step">⚙️ Paso 3 de 3 — Transferencia al agente</span>\n\n¡Excelente noticia! Hay un agente de ${deptName} disponible para atenderle. 🎉\n\nAntes de transferirle, por favor tenga a mano:\n✅ Su nombre completo\n✅ Su número de DPI o pasaporte\n✅ Un breve resumen de su consulta\n\nEn un momento le estaremos comunicando con uno de nuestros especialistas en ${deptName}. Muchas gracias por su paciencia. 😊\n\n━━━━━━━━━━━━━━\n🔄 [Sistema transfiere la conversación al área de ${deptName}]\n━━━━━━━━━━━━━━` }
          ]}
      ]}
    ]}
  };

const DEFAULT_FLOW = {
  id:"1", label:"Mensaje inicial del asistente", type:"menu", cat:"root",
  intents:["hola","buenas","buen día","información","ayuda"],
  detail:"👋 ¡Bienvenido al Instituto Guatemalteco de Migración! Soy el asistente virtual del IGM. ¿En qué puedo ayudarle hoy?\n1. Pasaportes\n2. Extranjería (visas y residencias)\n3. Control Migratorio\n4. Información general y otros trámites\n5. Hablar con un agente del IGM",
  children:[
    { id:"1.1", label:"Pasaportes", type:"menu", cat:"pasaportes",
      intents:["pasaporte","tramitar pasaporte","renovar pasaporte"],
      detail:"🛂 Seleccione la opción que necesita sobre Pasaportes:\n1. Tramitar o renovar pasaporte (adultos)\n2. Pasaporte para menores de edad\n3. Requisitos y costos\n4. Citas y reprogramación\n5. Extensión de pasaporte\n6. Pérdida, robo o pasaporte deteriorado\n7. Pasaporte en el extranjero\n8. Devolución de pago\n9. 🧑‍💼 Hablar con un agente de Pasaportes\n10. Volver al menú principal",
      children:[
        { id:"1.1.1", label:"Tramitar o renovar pasaporte (adultos)", type:"menu", cat:"pasaportes",
          intents:["tramitar pasaporte adulto","renovar pasaporte","primer pasaporte"],
          detail:`Para tramitar o renovar su pasaporte de adulto:\n1. Pago en Banrural (con DPI):\n   ✅ 5 años: 💰 USD 50.00\n   ✅ 10 años: 💰 USD 85.00\n2. Agendar cita: 🔗 ${L('https://servicios.igm.gob.gt/citasenlinea/')}`,
          children:[
            { id:"1.1.1.1", label:"Ver requisitos para el día de la cita", type:"final", cat:"pasaportes",
              intents:["requisitos cita pasaporte","qué llevar a la cita"],
              detail:`✅ DPI vigente y fotocopia legible\n✅ Boleta de pago Banrural\n✅ Constancia de cita impresa\n✅ Si es renovación: pasaporte anterior\n\nMás info: 🔗 ${L('https://igm.gob.gt/informacion-pasaportes/')}` },
            { id:"1.1.1.2", label:"Si extravié o me robaron el pasaporte anterior", type:"final", cat:"pasaportes",
              intents:["perdí mi pasaporte","me robaron el pasaporte"],
              detail:`Requiere denuncia original PNC o MP, además de los requisitos habituales.\n\nCita: 🔗 ${L('https://servicios.igm.gob.gt/citasenlinea/')}` },
            { id:"1.1.1.3", label:"Pasaporte anterior de pasta roja", type:"final", cat:"pasaportes",
              intents:["pasaporte pasta roja","pasaporte rojo"],
              detail:`Se gestiona como primer pasaporte. Requisitos: 🔗 ${L('https://igm.gob.gt/informacion-pasaportes/')}` },
          ]},
        { id:"1.1.2", label:"Pasaporte para menores de edad", type:"menu", cat:"pasaportes",
          intents:["pasaporte de mi hijo","pasaporte menor de edad"],
          detail:"Seleccione su situación:\n1. Ambos padres presentes en Guatemala\n2. Un padre no puede asistir (dentro de Guatemala)\n3. Un padre se encuentra en el extranjero\n4. Situación judicial (ausencia absoluta / patria potestad)\n5. Volver",
          children:[
            { id:"1.1.2.1", label:"Ambos padres presentes en Guatemala", type:"final", cat:"pasaportes",
              intents:["ambos padres pasaporte menor"],
              detail:`✅ Pago USD 50.00 (5 años, solo para menores)\n✅ DPI de ambos padres y fotocopia legible\n✅ Certificado de nacimiento (<6 meses)\n✅ Boleta de pago y constancia de cita\n\nMás info: 🔗 ${L('https://igm.gob.gt/requisitos-para-tramite-de-pasaportes-menores-de-edad/')}` },
            { id:"1.1.2.2", label:"Un padre no puede asistir (dentro de Guatemala)", type:"final", cat:"pasaportes",
              intents:["papá no puede asistir","mamá no puede asistir"],
              detail:`✅ Mandato Especial con Representación (original y copia legalizada)\n✅ Copia simple del DPI del padre ausente` },
            { id:"1.1.2.3", label:"Un padre se encuentra en el extranjero", type:"final", cat:"pasaportes",
              intents:["padre en el extranjero pasaporte menor"],
              detail:`Opción A — Carta Consular: legalizada en MINEX.\nOpción B — Mandato protocolizado en Guatemala.` },
            { id:"1.1.2.4", label:"Situación judicial / patria potestad", type:"final", cat:"pasaportes",
              intents:["patria potestad pasaporte menor","situación judicial"],
              detail:`✅ Resolución y certificación del 'Incidente' de un Juzgado de Familia.` },
          ]},
        { id:"1.1.3", label:"Requisitos y costos", type:"final", cat:"pasaportes",
          intents:["costo del pasaporte","cuánto cuesta","requisitos del pasaporte"],
          detail:`✅ 5 años: 💰 USD 50.00 (adultos y menores)\n✅ 10 años: 💰 USD 85.00 (solo adultos)\n\nBoleta vigente 1 año. Más info: 🔗 ${L('https://igm.gob.gt/informacion-pasaportes/')}` },
        { id:"1.1.4", label:"Citas y reprogramación", type:"menu", cat:"pasaportes",
          intents:["cita de pasaporte","agendar cita","reprogramar cita"],
          detail:"1. Programar una nueva cita\n2. Reprogramar una cita existente\n3. No hay citas disponibles\n4. Volver",
          children:[
            { id:"1.1.4.1", label:"Programar una nueva cita", type:"final", cat:"pasaportes",
              intents:["sacar cita pasaporte","nueva cita","agendar cita"],
              detail:`1. Pago en Banrural.\n2. Portal de citas: 🔗 ${L('https://servicios.igm.gob.gt/citasenlinea/')}\n3. Seleccionar fecha y hora.\n4. Imprimir constancia.\n\nHorario sedes: lunes a viernes de 7:00 a 15:00 horas.` },
            { id:"1.1.4.2", label:"Reprogramar una cita existente", type:"final", cat:"pasaportes",
              intents:["cambiar mi cita","reprogramar cita"],
              detail:`Necesita: boleta de pago, fecha de nacimiento y correlativo.\n\nReagendar: 🔗 ${L('https://servicios.igm.gob.gt/citasenlinea/modules/view/reagendar/')}\n\nSoporte: 2411-2411, ext. 124.` },
            { id:"1.1.4.3", label:"No hay citas disponibles", type:"final", cat:"pasaportes",
              intents:["no hay citas","sin citas disponibles"],
              detail:`Las citas se habilitan progresivamente. Revise constantemente: 🔗 ${L('https://servicios.igm.gob.gt/citasenlinea/')}\n\nEsté pendiente de redes sociales para jornadas extraordinarias.` },
          ]},
        { id:"1.1.5", label:"Extensión de pasaporte", type:"final", cat:"pasaportes",
          intents:["extender pasaporte","extensión de pasaporte"],
          detail:`Sin cita. Aplica a pasaportes 2013+ con menos de 6 meses de vigencia o vencidos.\n\n✅ Gratuita (18 meses): mín. 4 páginas en blanco.\n✅ 3 años (💰 USD 20.00): mín. 8 páginas en blanco.\n\nMás info: 🔗 ${L('https://igm.gob.gt/extension-de-vigencia-de-pasaporte-ordinario-guatemalteco-en-guatemala/')}` },
        { id:"1.1.6", label:"Pérdida, robo o pasaporte deteriorado", type:"final", cat:"pasaportes",
          intents:["pasaporte dañado","pasaporte deteriorado","pasaporte roto"],
          detail:`Pérdida/robo: denuncia original PNC o MP.\nDeteriorado: carta al IGM + pasaporte deteriorado.\n\nMás info: 🔗 ${L('https://igm.gob.gt/informacion-pasaportes/')}` },
        { id:"1.1.7", label:"Pasaporte en el extranjero", type:"final", cat:"pasaportes",
          intents:["pasaporte desde el extranjero","tramitar fuera del país"],
          detail:`Información: 🔗 ${L('https://igm.gob.gt/pasaportes-en-el-extranjero/')}\n\nTambién puede consultar con el consulado guatemalteco más cercano.` },
        { id:"1.1.8", label:"Devolución de pago", type:"final", cat:"pasaportes",
          intents:["devolución de pago","reembolso","error en mi pago"],
          detail:`Gestión en línea: 🔗 ${L('https://servicios.igm.gob.gt/web/servicios/identificacionint/pasaportes/devolucionpago')}\n\nTiempo estimado: 1-3 meses. Soporte: 2411-2411, ext. 124.` },
        agentSubflow("Pasaportes","pasaportes","1.1.9"),
      ]},
    { id:"1.2", label:"Extranjería (visas y residencias)", type:"menu", cat:"extranjeria",
      intents:["extranjería","visa","residencia"],
      detail:"🌍 ¿Qué trámite de Extranjería necesita?\n1. Clasificación de países y visas\n2. Residencias temporales y permanentes\n3. Prórroga de estadía / visa de turista\n4. Cuota anual y actualización de datos\n5. Garantes guatemaltecos\n6. Notificación de previo en extranjería\n7. 🧑‍💼 Hablar con un agente de Extranjería\n8. Volver al menú principal",
      children:[
        { id:"1.2.1", label:"Clasificación de países y visas", type:"menu", cat:"extranjeria",
          intents:["qué visa necesito","categoría de mi país","clasificación de países"],
          detail:"1. Categoría A – Exentos de visa\n2. Categoría B o C – Visa Consular\n3. Categoría C – Visa Consultada\n4. Volver",
          children:[
            { id:"1.2.1.1", label:"Categoría A – Exentos de visa", type:"final", cat:"extranjeria",
              intents:["países exentos de visa","no necesito visa"],
              detail:`No necesitan visa. Basta pasaporte vigente al ingresar.\n\nLista completa: 🔗 ${L('https://igm.gob.gt/clasificacion-de-paises/')}` },
            { id:"1.2.1.2", label:"Categoría B o C – Visa Consular", type:"final", cat:"extranjeria",
              intents:["visa consular","tramitar visa en mi país"],
              detail:`Tramitar en embajada de Guatemala antes de viajar.\n\nClasificación: 🔗 ${L('https://igm.gob.gt/clasificacion-de-paises/')}` },
            { id:"1.2.1.3", label:"Categoría C – Visa Consultada (en Guatemala)", type:"final", cat:"extranjeria",
              intents:["visa consultada","garante para visa"],
              detail:`Tramitada por garante guatemalteco en el IGM. Costo: 💰 USD 25.00. Presencial.\n\nFormularios: 🔗 ${L('https://igm.gob.gt/formularios-para-tramite-de-visa-guatemalteca/')}\nGarantes: 🔗 ${L('https://igm.gob.gt/garante-guatemalteco/')}` },
          ]},
        { id:"1.2.2", label:"Residencias temporales y permanentes", type:"menu", cat:"extranjeria",
          intents:["residencia","residencia temporal","residencia permanente"],
          detail:"1. Residencias temporales\n2. Residencia permanente (general)\n3. Por familiar guatemalteco / matrimonio\n4. Por hijo guatemalteco\n5. Cuánto dura el trámite\n6. Volver",
          children:[
            { id:"1.2.2.1", label:"Residencias temporales", type:"final", cat:"extranjeria",
              intents:["residencia temporal","tipos de residencia temporal"],
              detail:`Formularios: 🔗 ${L('https://igm.gob.gt/formularios-para-tramite-de-residencia-temporal/')}\n\nEn línea: tramitesextranjeria@igm.gob.gt\nCosto estatus migratorio: 💰 USD 30.00. Cuota anual: 💰 USD 40.00.` },
            { id:"1.2.2.2", label:"Residencia permanente (general)", type:"final", cat:"extranjeria",
              intents:["residencia permanente general"],
              detail:`Formularios: 🔗 ${L('https://igm.gob.gt/formularios-para-tramite-de-residencia-permanente/')}\n\nPago anual 💰 USD 40.00. Actualización de datos: 🔗 ${L('https://servicios.igm.gob.gt/web/servicios/extranjeria/actualizacionelectronica')}` },
            { id:"1.2.2.3", label:"Por familiar guatemalteco / matrimonio", type:"final", cat:"extranjeria",
              intents:["residencia por matrimonio","casado con guatemalteco"],
              detail:`Mínimo 1 año de casado/a. Garante debe ser guatemalteco.\n\nFormularios: 🔗 ${L('https://igm.gob.gt/formularios-para-tramite-de-residencia-permanente/')}` },
            { id:"1.2.2.4", label:"Por hijo guatemalteco", type:"final", cat:"extranjeria",
              intents:["residencia por hijo guatemalteco"],
              detail:`Costo: 💰 USD 25.00. Trámite personal.\nUbicación: 6ª Av. 3-11, Zona 4, 2º Nivel. Horario: 7am-2:30pm.` },
            { id:"1.2.2.5", label:"Cuánto dura el trámite de residencia", type:"final", cat:"extranjeria",
              intents:["cuánto tarda la residencia","duración trámite residencia"],
              detail:`30 días hábiles tras la entrega del expediente.` },
          ]},
        { id:"1.2.3", label:"Prórroga de estadía / visa de turista", type:"final", cat:"extranjeria",
          intents:["prórroga de visa","extender estadía","más de 90 días"],
          detail:`💰 USD 25.00. Antes del vencimiento. Sin cita.\n\nMulta por exceso: 💰 Q 15.00/día. Exoneración: Secretaría de la Presidencia (2318-4600).` },
        { id:"1.2.4", label:"Cuota anual y actualización de datos", type:"final", cat:"extranjeria",
          intents:["cuota anual de extranjería","actualizar datos"],
          detail:`En línea: tramitesextranjeria@igm.gob.gt\n\n✅ Cuota anual: 💰 USD 40.00\n✅ Estatus migratorio: 💰 USD 30.00\n\nActualización: 🔗 ${L('https://servicios.igm.gob.gt/web/servicios/extranjeria/actualizacionelectronica')}` },
        { id:"1.2.5", label:"Garantes guatemaltecos", type:"final", cat:"extranjeria",
          intents:["garante para visa","quién puede ser garante"],
          detail:`Debe ser guatemalteco (extranjeros no pueden ser garantes). Puede ser familiar.\n\nMás info: 🔗 ${L('https://igm.gob.gt/garante-guatemalteco/')}` },
        { id:"1.2.6", label:"Notificación de previo en extranjería", type:"final", cat:"extranjeria",
          intents:["notificación de previo","me notificaron un previo"],
          detail:`Presentarse ante Subdirección de Operaciones de Extranjería.\n✅ Costo: 💰 USD 5.00.` },
        agentSubflow("Extranjería","extranjeria","1.2.7"),
      ]},
    { id:"1.3", label:"Control Migratorio", type:"menu", cat:"control",
      intents:["control migratorio","trámite migratorio"],
      detail:"🛃 ¿Qué trámite de Control Migratorio necesita?\n1. Arraigos (consulta y certificación)\n2. Movimientos migratorios\n3. Registro migratorio (ingreso al país)\n4. Requisitos para salir de Guatemala\n5. Menores de edad viajando\n6. Multas por exceso de estadía\n7. Estatus bancario para extranjeros\n8. Apostilla\n9. 🧑‍💼 Hablar con un agente de Control Migratorio\n10. Volver al menú principal",
      children:[
        { id:"1.3.1", label:"Arraigos (consulta y certificación)", type:"menu", cat:"control",
          intents:["arraigo","consultar arraigo"],
          detail:"1. Consultar si tengo arraigo (en línea)\n2. Obtener certificación de arraigo\n3. Volver",
          children:[
            { id:"1.3.1.1", label:"Consultar si tengo arraigo (en línea)", type:"final", cat:"control",
              intents:["consultar arraigo en línea","verificar si tengo arraigo"],
              detail:`Consulta: 🔗 ${L('https://servicios.igm.gob.gt/web/servicios/controlmigratorio/consultaarraigos')}\n\n⚠️ NO constituye constancia jurídica. Solo referencia previa al viaje.\nTel: 2411-2411, ext. 158.` },
            { id:"1.3.1.2", label:"Obtener certificación de arraigo", type:"final", cat:"control",
              intents:["certificación de arraigo","constancia de arraigo"],
              detail:`1. Boleta Migrapagos en banco CHN: 🔗 ${L('https://migrapagos.igm.gob.gt/')} Costo: 💰 USD 10.00\n2. Solicitud: 🔗 ${L('https://servicios.igm.gob.gt/web/servicios/controlmigratorio/certarraigos')}\n\nEmisión inmediata por correo.` },
          ]},
        { id:"1.3.2", label:"Movimientos migratorios", type:"final", cat:"control",
          intents:["movimiento migratorio","certificación de movimiento migratorio"],
          detail:`1. Boleta Migrapagos en CHN: 🔗 ${L('https://migrapagos.igm.gob.gt/')} Costo: 💰 USD 10.00\n2. Solicitud: 🔗 ${L('https://servicios.igm.gob.gt/web/servicios/controlmigratorio/movimientomigratorio')}\n\nCertificación en 48-72h hábiles (lunes a viernes de 7:00 a 14:30 horas).` },
        { id:"1.3.3", label:"Registro migratorio (ingreso al país)", type:"final", cat:"control",
          intents:["ingreso al país","requisitos para entrar a guatemala"],
          detail:`✅ Pasaporte vigente\n✅ Visa (si aplica)\n✅ Entrevista en puesto migratorio\n✅ Solvencia económica\n✅ Reservación de hotel\n✅ Boleto de regreso\n\nMás info: 🔗 ${L('https://igm.gob.gt/requisitos-de-ingreso-a-territorio-guatemalteco/')}` },
        { id:"1.3.4", label:"Requisitos para salir de Guatemala", type:"final", cat:"control",
          intents:["salir del país","requisitos de salida","viajar fuera de guatemala"],
          detail:`Requisitos: 🔗 ${L('https://igm.gob.gt/requisitos-para-salir-de-guatemala/')}\n\n⚠️ Si tiene arraigo activo NO puede salir del país.` },
        { id:"1.3.5", label:"Menores de edad viajando", type:"menu", cat:"control",
          intents:["menor de edad viajando","niño viaja","hijo viaja"],
          detail:"1. El menor viaja solo\n2. Con uno de los padres\n3. Con ambos padres\n4. Volver",
          children:[
            { id:"1.3.5.1", label:"El menor viaja solo", type:"final", cat:"control",
              intents:["menor viaja solo","niño viaja sin papás"],
              detail:`✅ Pasaporte vigente\n✅ Certificado de nacimiento (<6 meses)\n✅ Carta Poder de AMBOS padres\n\nMás info: 🔗 ${L('https://igm.gob.gt/requisitos-para-salir-de-guatemala/')}` },
            { id:"1.3.5.2", label:"El menor viaja con uno de los padres", type:"final", cat:"control",
              intents:["menor viaja con un padre","niño viaja con mamá"],
              detail:`✅ Pasaporte vigente del menor\n✅ Certificado de nacimiento (<6 meses)\n✅ Carta Poder del padre que NO viaja` },
            { id:"1.3.5.3", label:"Ambos padres viajan con el menor", type:"final", cat:"control",
              intents:["menor viaja con ambos padres"],
              detail:`✅ Pasaporte vigente del menor\n✅ DPI de ambos padres` },
          ]},
        { id:"1.3.6", label:"Multas por exceso de estadía", type:"final", cat:"control",
          intents:["multa por exceso de estadía","pagar multa migración"],
          detail:`💰 Q 15.00/día. Pago en oficinas centrales o Aeropuerto La Aurora.\n\nExoneración: Secretaría de la Presidencia (2318-4600).` },
        { id:"1.3.7", label:"Estatus bancario para extranjeros", type:"final", cat:"control",
          intents:["estatus bancario extranjero","abrir cuenta banco siendo extranjero"],
          detail:`💰 USD 25.00. Requisitos:\n✅ Pasaporte vigente (original y copia)\n✅ Copia del sello de ingreso\n\nUbicación: 6ª Av. 3-11, Zona 4.` },
        { id:"1.3.8", label:"Apostilla", type:"final", cat:"control",
          intents:["apostilla","apostillar documento"],
          detail:`Trámite en línea: 🔗 ${L('https://apostilla.minex.gob.gt/registro')}\n\nContacto MINEX: 2410-0000 / 2410-0102.` },
        agentSubflow("Control Migratorio","control","1.3.9"),
      ]},
    { id:"1.4", label:"Información general y otros trámites", type:"menu", cat:"info",
      intents:["información general","otros trámites"],
      detail:"ℹ️ ¿Qué información necesita?\n1. Ubicaciones y horarios de sedes\n2. Solicitud de refugio\n3. Viajeros centroamericanos (sin pasaporte)\n4. Solicitud de empleo en el IGM\n5. Legalización de firma del Director General\n6. Preguntas frecuentes rápidas\n7. 🧑‍💼 Hablar con un agente de Información General\n8. Volver al menú principal",
      children:[
        { id:"1.4.1", label:"Ubicaciones y horarios de sedes", type:"final", cat:"info",
          intents:["ubicación igm","dirección de oficinas","horario de atención"],
          detail:`Con mucho gusto le indicamos las ubicaciones y horarios de atención de nuestras sedes. Seleccione la sede de su interés para ver su dirección y horario:\n\n<details><summary>📍 Ciudad de Guatemala (Central)</summary>6ª Av. 3-11, Zona 4, Ciudad de Guatemala.<br>Lunes a viernes de 7:00 a 15:00 horas.</details>\n\n<details><summary>📍 Chiquimula</summary>7ª Av. 5-47, Zona 1, Chiquimula.<br>Lunes a viernes de 7:00 a 15:00 horas.</details>\n\nPara consultar la lista completa de sedes de emisión de pasaportes: 🔗 ${L('https://igm.gob.gt/ubicacion-de-centros-de-emision-de-pasaportes-y-horario/')}` },
        { id:"1.4.2", label:"Solicitud de refugio", type:"final", cat:"info",
          intents:["refugio","asilo","solicitar refugio"],
          detail:`Entendemos que solicitar refugio puede ser un momento difícil, y queremos que sepa que el IGM está aquí para orientarle con toda la atención y discreción que usted merece. 🤝\n\nNuestro equipo especializado en la Dirección de Refugio y Estatuto de Refugiado está disponible para atenderle y acompañarle durante el proceso. Puede contactarnos por cualquiera de los siguientes medios:\n\n✅ Correo electrónico: drer@igm.gob.gt\n✅ Teléfonos: 2231-7200 / 2411-2411 (extensiones 185, 198, 200 y 201)\n✅ Ubicación: 7ª Av. 14-44, Zona 9, Edificio La Galería, 2do. Nivel, Oficina 15B\n\nTambién puede presentarse personalmente en nuestras instalaciones durante el horario de atención, donde uno de nuestros agentes especializados le recibirá y orientará en cada paso del proceso.` },
        { id:"1.4.3", label:"Viajeros centroamericanos (sin pasaporte)", type:"final", cat:"info",
          intents:["viajar sin pasaporte","ir a el salvador con dpi"],
          detail:`Mayores de edad pueden viajar a El Salvador, Honduras y Nicaragua solo con DPI (vía terrestre).\n\n⚠️ Vía aérea o menores: pasaporte obligatorio.` },
        { id:"1.4.4", label:"Solicitud de empleo en el IGM", type:"final", cat:"info",
          intents:["trabajo en el igm","empleo en migración","vacantes igm"],
          detail:`Formulario banco de talento: 🔗 ${L('https://docs.google.com/forms/d/e/1FAIpQLSeU8nhiqxG45MHBOQ7KGzc5O4CFIf-zQmzHrA0YuabRH33mJw/viewform')}\n\nEsté pendiente de redes sociales oficiales.` },
        { id:"1.4.5", label:"Legalización de firma del Director General", type:"final", cat:"info",
          intents:["legalización de firma director","firma del director general"],
          detail:`Presencial, Unidad de Certificaciones (4to nivel).\n\n✅ Timbre fiscal Q 10.00\n✅ Pago Q 191.00\n\nPlazo: 8 días hábiles.` },
        { id:"1.4.6", label:"Preguntas frecuentes rápidas", type:"final", cat:"info",
          intents:["preguntas frecuentes","dudas rápidas"],
          detail:`¿Cuándo renovar el pasaporte? — Cualquier momento. Mín. 6 meses para salir del país.\n¿Con arraigo puedo salir? — No.\n¿Vigencia boleta de pago? — 1 año.\n\nWhatsApp: 3757-0902 | Tel: 2411-2411` },
        agentSubflow("Información General","info","1.4.7"),
      ]},
    { id:"1.5", label:"Hablar con un agente del IGM", type:"menu", cat:"agente",
      intents:["agente","hablar con alguien","persona","humano","asesor"],
      detail:"🧑‍💼 Con gusto le comunico con uno de nuestros agentes. Para conectarle con el especialista indicado, ¿con qué área desea hablar?\n\n1. 🛂 Pasaportes\n2. 🌍 Extranjería (visas y residencias)\n3. 🛃 Control Migratorio\n4. ℹ️ Información General y otros trámites\n5. ↩️ Volver al menú principal",
      children:[
        agentSubflow("Pasaportes","pasaportes","1.5.1"),
        agentSubflow("Extranjería","extranjeria","1.5.2"),
        agentSubflow("Control Migratorio","control","1.5.3"),
        agentSubflow("Información General","info","1.5.4"),
      ]},
  ]
};