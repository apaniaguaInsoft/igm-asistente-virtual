# Rewrite Rules — IGM Tiledesk Humanizer

## Core Writing Principles

### Voice & tone
- Use **usted** (formal) consistently throughout — this is a requirement from the client. The bot is an official government service and must maintain a respectful, formal register.
- The first-person plural for the bot's own actions is still natural: "le estamos conectando", "le ayudamos", "encontrará aquí".
- Lead with empathy and warmth even in formal register — "Disculpe la espera", "Entendemos que su situación es importante", "Con mucho gusto le ayudamos".
- End informational blocks with a clear next step or open question — never leave the user without a path forward.

**Every response must feel warm.** Even when listing costs, requirements, or steps, the message should feel like a knowledgeable person guiding the user — not a printed form. Concretely:
- Present costs and options as choices the user makes ("El costo depende de la vigencia que elija"), not as a catalog entry ("Vigencia de 5 años: USD 50.00").
- Frame requirements as things the user will need for a successful outcome, not as rules they must follow.
- Avoid neutral or mechanical intros ("Los requisitos son:") — replace with a sentence that shows the bot is helping ("Para el día de su cita, asegúrese de llevar:").
- A message that reads like a government pamphlet should always be rewritten, even if the facts are correct.

### Costs — integration rule
Never present costs as a standalone section dropped after an unrelated intro. If the intro says "deberá presentar documentos" and the next line is a price list, the user doesn't know what they're paying for or when.

**Rule:** When a block has multiple costs, or when the cost needs context to make sense, integrate it into a sentence that explains what the charge is for and when it applies.

Bad:
```
Para solicitar residencia temporal, deberá presentar los documentos requeridos en el IGM.

💰 Costo de estatus migratorio: USD 30.00
💰 Cuota anual: USD 40.00
```

Good:
```
Para solicitar residencia temporal en Guatemala deberá presentar los documentos requeridos en el IGM. El trámite tiene dos cobros: USD 30.00 por el estatus migratorio (pago único al tramitar) y USD 40.00 de cuota anual que se renueva cada año mientras mantenga su residencia.
```

The key questions to answer when integrating costs:
- ¿Es un pago único o recurrente?
- ¿Qué se obtiene con ese pago?
- ¿Se pagan juntos o en momentos distintos?

If a block has only one cost and its purpose is obvious from context, a short inline mention is fine: "con un costo de 💰 USD 25.00".

### What NOT to do with usted
- Do NOT use voseo ("usted" is correct; avoid "vos")
- Do NOT use "ustedes" in singular — each message is to one user
- Do NOT use "le" and "te" in the same message — pick usted throughout

### Structure
- Never use a section title as the first line of a message (e.g., "📋 Requisitos para el día de la cita" as the sole first line). Lead with a sentence that tells the user what they're about to see.
- Keep bullet lists, but precede them with a short intro sentence that explains why they're reading this list
- Short paragraphs over walls of text — Tiledesk renders in a small chat bubble
- Use `\n\n` between logical sections

### Title formatting
When a message includes a title or heading, always format it in bold using Tiledesk's markdown syntax: `**título**` (double asterisks). This applies to section titles, sub-section labels, option headers, and any text that serves as a heading within a message.

**Examples:**
- `**Documentos requeridos:**` (not plain `Documentos requeridos:`)
- `**Paso 1 — Pago en Banrural**` (not plain `Paso 1 — Pago en Banrural`)
- `**Opción A — Carta Consular:**` (not plain `Opción A — Carta Consular:`)

This makes messages easier to scan in the chat bubble and creates a clear visual hierarchy between headings and body text.

### URL buttons — always reference them in the message text
If a block has one or more `"type": "url"` buttons, the message text **must** explicitly tell the user the button exists. Users often miss buttons, especially on mobile. Rules:

- End the message with a line pointing to the button. Use usted form:
  - One button: `"👆 Presione el botón de abajo para [acción]."`
  - Two buttons: `"👆 Presione los botones de abajo para [acción]."`
  - Already inside a list flow: `"Puede acceder a los formularios usando los botones de abajo:"`
- Never use tú-form verbs like "Presiona", "Utiliza", "inicia" — always "Presione", "Utilice", "inicie"
- The call-to-action must come **after** the content, never at the start
- If the URL button label is descriptive enough (e.g., "Portal de Citas"), you can reference it by name: `"Presione el botón Portal de Citas de abajo para agendar su cita."`

Bad (no mention of button):
```
✅ Boleta de pago Banrural
✅ Constancia de cita impresa
```

Good:
```
✅ Boleta de pago Banrural
✅ Constancia de cita impresa

👆 Presione el botón de abajo para consultar más información en el portal del IGM.
```

### Navigation breadcrumbs (sub-menus)
Every sub-menu block must start with a breadcrumb line so users always know where they are. Format:

```
[emoji] [Sección] › [Sub-sección]
```

Examples:
- `📋 Pasaportes › Tramitar o renovar (adultos)`
- `📅 Pasaportes › Citas`
- `👦 Pasaportes › Pasaporte para menores de edad`
- `🌐 Extranjería › Visas`
- `📂 Control Migratorio › Arraigos`

After the breadcrumb, always add a warm sentence in usted that tells the user what they can do here — never jump straight to a button list. Example:
```
📋 Pasaportes › Tramitar o renovar (adultos)

Con gusto le oriento. Para tramitar o renovar su pasaporte...
```

Top-level section menus (`pasaportes_menu`, `extranjeria_menu`, etc.) do **not** need a breadcrumb — instead open with a warm sentence: "Con gusto le oriento en sus trámites de Pasaportes. ¿En qué le puedo ayudar?"

### Emojis
- Keep emojis — they help scan-ability on mobile
- One emoji per bullet item max; one in the opening line is fine
- Don't add emojis where there are none today unless it genuinely helps readability

### Language consistency
- Guatemalan Spanish — avoid voseo
- "cita" not "appointment"; "trámite" not "gestión"; "pasaporte" always lowercase
- Amounts: keep the existing format (Q 10.00, USD 25.00)

---

## Phase 1 — Block-by-Block Rewrites

### GLOBAL BLOCKS

**`menu_principal`**
```
Current:  ¿En qué puedo ayudarle hoy?\n\nSelecciona una opción:
Proposed: 😊 ¿En qué le puedo ayudar hoy?\n\nPor favor seleccione una de las siguientes opciones:
```

**`bienvenida`**
```
Current:  👋 ¡Bienvenido al Instituto Guatemalteco de Migración! Soy el asistente virtual del IGM.
Proposed: 👋 ¡Bienvenido/a al Instituto Guatemalteco de Migración! Soy el asistente virtual del IGM y estoy aquí para orientarle con sus trámites migratorios.
```

**`defaultFallback`**
```
Current:  😅 Disculpa, no he entendido tu mensaje. Puedes regresar al menú principal.\n\n📌 *¿Qué deseas hacer ahora?*
Proposed: 😅 Disculpe, no logré entender bien su mensaje. No se preocupe, podemos retomar desde el menú principal. 👇\n\n📌 *¿En qué le puedo ayudar?*
```

**`timeout_inactividad`**
```
Current:  No hubo respuesta por más de 10 minutos, se cerró el chat automáticamente. ¡Que tenga buen día! 😊
Proposed: Parece que no hubo respuesta en un momento, por lo que cerramos el chat. Cuando lo necesite, puede volver a contactarnos. ¡Que tenga un excelente día! 😊
```

---

### PASAPORTES

**`psp_citas_nueva`**
```
Current:  🆕 Programar una nueva cita\n\n- Pago en Banrural.\n- Portal de citas\n- Seleccionar fecha y hora.\n- Imprimir constancia.\n\nHorario sedes: lunes a viernes de 7:00 a 15:00 horas.

Proposed: 🆕 Para agendar su cita, siga estos pasos:\n\n1️⃣ Realice su pago en cualquier agencia Banrural\n2️⃣ Ingrese al Portal de Citas (botón abajo)\n3️⃣ Seleccione la fecha y hora de su preferencia\n4️⃣ Imprima o guarde su constancia de cita\n\n📅 Atención en sedes: lunes a viernes de 7:00 a 15:00 horas.
```

**`psp_tramitar_requisitos_cita`**
```
Current:  📋 Requisitos para el día de la cita\n\n✅ DPI vigente y fotocopia legible\n✅ Boleta de pago Banrural\n✅ Constancia de cita impresa\n✅ Si es renovación: pasaporte anterior

Proposed: 📋 Para el día de su cita, por favor asegúrese de llevar lo siguiente:\n\n✅ DPI vigente y fotocopia legible\n✅ Boleta de pago Banrural\n✅ Constancia de cita impresa\n✅ Si es renovación: su pasaporte anterior
```

**`psp_menores_un_padre_gt`**
```
Current:  👤 Un padre no puede asistir (dentro de GT)\n\n✅ Mandato Especial con Representación (original y copia legalizada)\n✅ Copia simple del DPI del padre ausente

Proposed: 👤 Si uno de los padres no puede asistir ese día pero se encuentra en Guatemala, puede autorizar a otra persona. Documentos necesarios:\n\n✅ Mandato Especial con Representación (original y copia legalizada)\n✅ Copia simple del DPI del padre que no asistirá
```

**`psp_menores_padre_extranjero`**
```
Current:  ✈️ Un padre se encuentra en el extranjero\n\nOpción A — Carta Consular: legalizada en MINEX.\nOpción B — Mandato protocolizado en Guatemala.

Proposed: ✈️ Si uno de los padres se encuentra en el extranjero, cuenta con dos opciones para autorizar el trámite:\n\nOpción A — Carta Consular legalizada ante el Ministerio de Relaciones Exteriores (MINEX)\nOpción B — Mandato protocolizado ante notario en Guatemala
```

**`psp_pasaporte_extranjero`**
```
Current:  ✈️ Pasaporte en el extranjero\n\nPuede consultar con el consulado guatemalteco más cercano.\n\nPresione para ver más información:

Proposed: ✈️ Si usted se encuentra fuera de Guatemala y necesita su pasaporte, el consulado guatemalteco más cercano puede orientarle. Aquí encontrará toda la información:
```

**`psp_perdida_robo_deteriorado`**
```
Current:  🚨 Perdí o me robaron el pasaporte anterior\n\nRequiere denuncia original PNC o MP, además de los requisitos habituales.

Proposed: 🚨 Lamentamos que se encuentre en esta situación. Además de los requisitos habituales, deberá presentar una denuncia original de la PNC o el MP.
```

**`fuera_horario_Pasaportes`** (applies to all `fuera_horario_*` blocks with similar structure)
```
Pattern to follow:
- Shorter first sentence with empathy: "En este momento nuestras oficinas de [sección] se encuentran cerradas. 😔"
- Clear hours without the long embedded paragraph: "📅 Atención: lunes a viernes de 7:00 a 13:00 y 14:00 a 15:00 h"
- Keep the self-service options but put them in a bullet list
- Keep the buttons exactly as-is
- Use usted throughout: "puede intentarlo", "le atenderemos"
```

**`agente_no_disp_Pasaportes`** (applies to all `agente_no_disp_*` blocks)
```
Pattern to follow:
Current tone: abrupt notice of no availability
Proposed tone: "En este momento todos nuestros agentes están atendiendo otras consultas. 😔 Mientras tanto, le invitamos a seguir explorando la información disponible aquí 👇"
```

---

### EXTRANJERÍA

**`ext_categoria_c_consultada`**
```
Current:  📝 Categoría C – Visa Consultada (en GT)\n\nTramitada por garante guatemalteco en el IGM. Costo: 💰 USD 25.00. Presencial.

Proposed: 📝 La Visa Categoría C se tramita de forma presencial en el IGM, con el apoyo de un garante guatemalteco.\n\n💰 Costo: USD 25.00\n\nA continuación encontrará los formularios y la información sobre garantes:
```

**`ext_garantes_guatemaltecos`**
```
Pattern to follow:
- Split into two clear sections with `\n\n` separator
- First: brief explanation of what a garante is (1-2 sentences), using usted  
- Second: the document list with bullet items
```

**`ext_residencia_temporal`**
```
Applied:
Para solicitar residencia temporal en Guatemala deberá presentar los documentos requeridos en el IGM. El trámite tiene dos cobros: USD 30.00 por el estatus migratorio (pago único al tramitar) y USD 40.00 de cuota anual que se renueva cada año mientras mantenga su residencia.

Puede descargar los formularios o iniciar su trámite por correo usando los botones de abajo:
```
Note: costs were integrated into the intro sentence (not listed separately) — see "Costs — integration rule" above.

---

### CONTROL MIGRATORIO

**`ctrl_menor_ambos_padres`**
```
Current:  👨‍👩‍👦 Con ambos padres\n\n✅ Pasaporte vigente del menor\n✅ DPI de ambos padres

Proposed: 👨‍👩‍👦 Si el menor viaja con ambos padres, necesitan presentar:\n\n✅ Pasaporte vigente del menor\n✅ DPI de ambos padres
```

**`ctrl_multas_estadia`**
```
Pattern to follow:
- Open with context: "Si usted permaneció más tiempo del autorizado en Guatemala, se generan multas por estadía irregular."
- Then list the relevant information
- Add a note about where to pay (if known)
- Use usted throughout
```

---

### AGENT HANDOFF (all departments)

**`agente_disp_*` blocks**
```
Pattern — personalize per department, use usted:
- Pasaportes: "¡Con gusto le atendemos! Le estamos conectando con un agente especialista en Pasaportes. Solo un momento… 🔄"
- Extranjería: "¡Con gusto le atendemos! Le estamos conectando con un agente de Extranjería. Solo un momento… 🔄"
- Control Migratorio: "¡Con gusto le atendemos! Le estamos conectando con un agente de Control Migratorio. Solo un momento… 🔄"
- Información General: "¡Con gusto le atendemos! Le estamos conectando con un agente que podrá orientarle. Solo un momento… 🔄"
- PRH: "¡Con gusto le atendemos! Le estamos conectando con un especialista del Plan Retorno al Hogar. Solo un momento… 🔄"
```

**`agente_no_disp_*` blocks**
```
Pattern — use usted, add empathy:
"En este momento todos nuestros agentes están atendiendo otras consultas. 😔 Le pedimos disculpas por la espera. Mientras tanto, le invitamos a seguir explorando la información disponible aquí 👇"
```

---

## Phase 2 — New Intent Blocks

For each new block below, use the JSON structure from `TILEDESK_FLOW_GUIDE.md` (section "Adding a completely new intent block") and follow these content guidelines. All messages must use **usted** (formal).

### 2.1 `psp_tramitar_por_primera_vez` (NEW)
- Parent: `psp_tramitar_adultos_menu` (add a button there)
- Message: "🆕 ¿Es la primera vez que tramita un pasaporte guatemalteco? Le explicamos el proceso paso a paso:\n\n1️⃣ Agende su cita en el Portal de Citas\n2️⃣ Realice su pago en Banrural\n3️⃣ Preséntese con sus documentos el día de la cita\n\nEl tiempo de entrega es de aproximadamente 15 días hábiles."
- nextBlockAction: → `psp_tramitar_requisitos_cita`
- Color: `86,179,101`

### 2.2 `psp_tramitar_renovacion` (NEW)
- Parent: `psp_tramitar_adultos_menu` (add a button there)
- Message: "🔄 Para renovar su pasaporte, el proceso es igual a tramitar uno nuevo. Recuerde traer también su pasaporte anterior.\n\nSi su pasaporte fue robado, perdido o está deteriorado, hay requisitos adicionales."
- nextBlockAction: → `psp_tramitar_requisitos_cita`
- Color: `86,179,101`
- Add a button to `psp_perdida_robo_deteriorado` for the theft/loss case

### 2.3 `ctrl_multas_calculo` (NEW)
- Parent: `ctrl_multas_estadia` (add buttons there)
- Message: "🧮 Las multas por estadía irregular se calculan por día de permanencia no autorizada.\n\nEl monto varía según el tiempo transcurrido. Le recomendamos consultar en ventanilla o con un agente para conocer su caso específico."
- nextBlockAction: → `ctrl_regresar`
- Color: `179, 140, 0`

### 2.4 `ctrl_multas_pago` (NEW)
- Parent: `ctrl_multas_estadia` (add buttons there)
- Message: "💳 El pago de multas por estadía se realiza directamente en las oficinas del IGM.\n\nNuestros agentes pueden orientarle sobre el proceso exacto según su situación."
- nextBlockAction: → `ctrl_regresar`
- Color: `179, 140, 0`

### 2.5 `prh_que_es_el_programa` (NEW)
- Parent: `prh_menu` (add a button at the top of the menu)
- Message: "🏡 El Plan Retorno al Hogar (PRH) es el programa del IGM que apoya a guatemaltecos deportados o que regresan voluntariamente al país.\n\nOfrecemos orientación sobre documentación, empleo, salud y reunificación familiar para facilitar su proceso de reintegración."
- nextBlockAction: → `prh_preguntas_frecuentes_menu`
- Color: `56, 142, 60`

### 2.6 `info_estado_tramite` (NEW)
- Parent: `info_general_menu` (add a button there)
- Message: "🔎 Para verificar el estado de su trámite migratorio, puede:\n\n1️⃣ Consultar en línea en el Portal de Servicios IGM\n2️⃣ Comunicarse con nuestro número de atención al ciudadano\n3️⃣ Visitar la sede donde realizó el trámite\n\nSi desea hablar con un agente, podemos conectarle ahora mismo."
- nextBlockAction: → `info_regresar`
- Color: `0, 179, 98`
- Add a URL button to `https://servicios.igm.gob.gt` and an action button to the agent flow

---

## Button `alias` field — NLU keyword matching

Every action button has an `"alias"` field. Tiledesk uses this to match what the user *types* to the correct menu option, so if the user writes "quiero tramitar mi pasaporte" the bot can recognize it and route them correctly even without a click.

**Always fill in `alias` when creating or editing buttons.** Use a comma-separated list of natural phrases — no quotes, no special characters.

Rules:
- Include the core noun/verb the user would type (e.g., `tramitar, renovar`)
- Include common misspellings or shorthand if obvious (e.g., `cita, citas, agendar`)
- Don't duplicate the `value` label verbatim — aliases should catch free-text, not button clicks
- Keep each alias short (1-3 words per term)

Examples:
| Button `value` | `alias` |
|---|---|
| 📋 Tramitar o renovar (adultos) | `tramitar, renovar, pasaporte adulto, nuevo pasaporte` |
| 📅 Citas y reprogramación | `cita, citas, agendar, reprogramar, cambiar cita` |
| 👦 Pasaporte para menores de edad | `menor, niño, niña, hijo, hija, menores` |
| 🚨 Pérdida, robo o deteriorado | `perdi, robo, robaron, extraviado, deteriorado` |
| 🏠 Menú principal | `menu, inicio, volver, regresar, empezar` |
| ⬅️ Volver a Pasaportes | `volver, regresar, pasaportes` |
| 🆕 Programar una nueva cita | `nueva cita, programar, agendar cita` |
| 🔄 Reprogramar una cita existente | `reprogramar, cambiar cita, mover cita` |

---

## What NOT to change

- Any intent block with `"readonly": true` (`defaultFallback`, `start`) — you can change the text but not the structure
- URLs in link buttons — do not update links unless the user explicitly provides the correct new URL
- `intent_id` UUID values — never
- The order of buttons in menus — preserve user-defined order unless explicitly asked to reorder
