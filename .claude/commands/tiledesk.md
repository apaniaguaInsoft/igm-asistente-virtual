# Skill: /tiledesk

Ayuda a crear y modificar el archivo `igm-tiledesk.json` — el bot de Tiledesk para el chat web del IGM.

## Cómo usar

Describe lo que quieres hacer en lenguaje natural:

- `/tiledesk agrega un menú de "Búsqueda de migrantes" con 3 opciones`
- `/tiledesk cambia el texto de bienvenida`
- `/tiledesk agrega un botón de "Quejas y denuncias" al menú principal`
- `/tiledesk crea un flujo de agente para el departamento de Retornados`

---

## Contexto del proyecto

- El bot está en `igm-tiledesk.json` (en la raíz del proyecto).
- Es para el **chat web de Tiledesk**, no WhatsApp — no usar `webrequestv2` de Facebook Graph API.
- El bot se llama **Mateo**, asistente del Instituto Guatemalteco de Migración (IGM).

---

## Estructura JSON del archivo

```json
{
  "webhook_enabled": false,
  "language": "es",
  "name": "Mateo IGM Web",
  "slug": "igm-web-v1",
  "type": "tilebot",
  "subtype": "chatbot",
  "attributes": { "variables": {}, "rules": [] },
  "intents": [ /* array de bloques */ ]
}
```

---

## Anatomía de un intent (bloque)

```json
{
  "webhook_enabled": false,
  "enabled": true,
  "intent_display_name": "nombre_del_bloque",
  "intent_id": "UUID-v4",
  "language": "es",
  "question": "palabra clave opcional\notra frase",
  "actions": [ /* array de acciones */ ],
  "attributes": {
    "position": { "x": 0, "y": 0 },
    "readonly": false,
    "color": "86,179,101",
    "nextBlockAction": {
      "_tdActionId": "hex-16-bytes",
      "_tdActionType": "intent",
      "intentName": "#UUID-del-siguiente-intent"
    }
  },
  "agents_available": false
}
```

**Reglas:**
- `intent_id`: UUID v4 único. Generarlo con `crypto.randomUUID()`.
- `nextBlockAction.intentName`: `#UUID` del intent que sigue automáticamente (sin botón). Si no hay siguiente, usar `null`.
- `question`: palabras clave que el usuario puede escribir para llegar a este bloque directamente (sin botón). Separadas por `\n`. Opcional.
- `readonly: true` solo para `start` y `defaultFallback`.

---

## Tipos de acciones (`_tdActionType`)

### `reply` — mensaje simple, sin botones, sin timeout
```json
{
  "_tdActionTitle": "",
  "_tdActionId": "hex-16-bytes",
  "_tdActionType": "reply",
  "attributes": {
    "disableInputMessage": false,
    "commands": [
      { "type": "wait", "time": 500 },
      {
        "type": "message",
        "message": {
          "type": "text",
          "text": "Texto del mensaje aquí",
          "attributes": {
            "attachment": { "type": "template", "buttons": [], "json_buttons": "" }
          }
        }
      }
    ]
  }
}
```
Usar para nodos hoja (información sin opciones). El `nextBlockAction` del intent apunta al intent "regresar" de su sección.

---

### `replyv2` — mensaje con botones de acción + timeout
```json
{
  "_tdActionTitle": "",
  "_tdActionId": "hex-16-bytes",
  "_tdActionType": "replyv2",
  "attributes": {
    "disableInputMessage": false,
    "commands": [
      { "type": "wait", "time": 500 },
      {
        "type": "message",
        "message": {
          "type": "text",
          "text": "Texto del menú",
          "attributes": {
            "attachment": {
              "type": "template",
              "buttons": [ /* ver estructura de botón abajo */ ],
              "json_buttons": ""
            }
          }
        }
      }
    ]
  },
  "noInputTimeout": 660000,
  "noInputIntent": "#UUID-del-intent-timeout"
}
```
Usar para menús con opciones. El `noInputIntent` debe apuntar al intent `timeout_inactividad`.

**Estructura de cada botón:**
```json
{
  "uid": "hex-16-bytes",
  "type": "action",
  "value": "Texto visible del botón",
  "link": "",
  "target": "blank",
  "action": "#UUID-del-intent-destino",
  "attributes": "",
  "show_echo": true,
  "alias": ""
}
```

---

### `wait` — pausa en milisegundos
```json
{ "_tdActionTitle": "", "_tdActionId": "hex-16-bytes", "_tdActionType": "wait", "millis": 1000 }
```

---

### `intent` — redirigir a otro intent directamente (sin mensaje)
```json
{ "_tdActionType": "intent", "intentName": "#UUID-destino", "_tdActionId": "hex-16-bytes" }
```
Usado en el bloque `start` para apuntar a `bienvenida`.

---

### `ifopenhours` — bifurcar según horario de atención configurado en Tiledesk
```json
{
  "_tdActionTitle": "",
  "_tdActionId": "hex-16-bytes",
  "stopOnConditionMet": true,
  "_tdActionType": "ifopenhours",
  "trueIntent": "#UUID-si-dentro-horario",
  "falseIntent": "#UUID-si-fuera-horario",
  "slotId": null
}
```

---

### `ifonlineagentsv2` — bifurcar si hay agentes disponibles en un departamento
```json
{
  "_tdActionTitle": "",
  "_tdActionId": "hex-16-bytes",
  "stopOnConditionMet": true,
  "_tdActionType": "ifonlineagentsv2",
  "selectedOption": "selectedDep",
  "ignoreOperatingHours": false,
  "trueIntent": "#UUID-si-hay-agentes",
  "falseIntent": "#UUID-si-no-hay-agentes",
  "selectedDepartmentId": "ID-del-departamento-en-Tiledesk"
}
```
El `selectedDepartmentId` se obtiene desde el dashboard de Tiledesk → Configuración → Departamentos.

---

### `department` — enviar conversación a un departamento
```json
{
  "_tdActionTitle": "",
  "_tdActionId": "hex-16-bytes",
  "_tdActionType": "department",
  "depName": "Nombre del Departamento",
  "triggerBot": false
}
```

---

### `agent` — transferir al agente humano (sin parámetros extra)
```json
{ "_tdActionTitle": "", "_tdActionId": "hex-16-bytes", "_tdActionType": "agent" }
```

---

### `close` — cerrar conversación
```json
{ "_tdActionTitle": "", "_tdActionId": "hex-16-bytes", "_tdActionType": "close" }
```

---

## Patrones recurrentes

### Patrón: nodo hoja (información)
1. Intent con `actions: [reply(texto)]`
2. `nextBlockAction` → intent `xxx_regresar` de su sección

### Patrón: menú con submenús
1. Intent con `actions: [replyv2(texto, botones)]`
2. Cada botón apunta al intent hijo correspondiente
3. Siempre incluir botón "Volver" al menú padre y botón "Menú principal"

### Patrón: intent "regresar" (al final de cada sección)
Intent con `replyv2` que muestra dos botones:
- "Volver al menú anterior" → menú de la sección
- "Ir al menú principal" → `menu_principal`

### Patrón completo: flujo de agente humano (6 intents)
```
[menu_agente] → replyv2 "¿Conectar con agente?" → botón → [check_horario]
[check_horario] → ifopenhours → true: [check_agentes] | false: [fuera_horario]
[fuera_horario] → replyv2 "Fuera de horario" + botones: reintentar, menú
[check_agentes] → ifonlineagentsv2 → true: [agente_disp] | false: [no_disp]
[no_disp] → replyv2 "Sin agentes" + botones: reintentar, menú
[agente_disp] → reply "Conectando..." → nextBlock: [send_dept]
[send_dept] → department → nextBlock: [send_to_agent]
[send_to_agent] → agent (intent compartido, ya existe en el archivo)
```

---

## IDs de departamentos actuales (Tiledesk)

| Departamento | ID |
|---|---|
| Pasaportes | `69dd1b0420c75500128e50c2` |
| Extranjería | `69dd1b3120c75500128e51a3` |
| Control Migratorio | `69dd1b4420c75500128e525a` |
| Plan Retorno al Hogar | `69b4512f31ec3c0013333d9f` |
| Chatbot / Info General | `69b4514431ec3c0013333dbb` |

---

## Colores por sección (para `color` en attributes)

| Sección | Color |
|---|---|
| Sistema / Menú principal | `80,100,147` |
| Pasaportes | `86,179,101` |
| Extranjería | `204,68,75` |
| Control Migratorio | `179, 140, 0` |
| Información General | `9, 0, 179` |
| Flujo agente (check) | `0, 179, 143` |
| Flujo agente (sin agentes) | `0, 179, 119` |
| Flujo agente (disponible) | `0, 179, 131` |
| Flujo agente (send dept) | `0, 179, 134` |
| Fuera de horario | `204,68,75` |

---

## Instrucciones para Claude

Cuando se invoca `/tiledesk`:

1. **Leer** `igm-tiledesk.json` para entender el estado actual.
2. **Identificar** qué cambio pide el usuario: nuevo intent, modificar texto, nuevo botón, nuevo flujo completo, etc.
3. **Generar** los nuevos intents o cambios usando la estructura exacta de este documento.
4. **Usar** `crypto.randomUUID()` para `intent_id` y `crypto.randomBytes(16).toString('hex')` para `_tdActionId` y `uid` de botones.
5. **Verificar** que todas las referencias (`action`, `trueIntent`, `falseIntent`, `intentName`, `noInputIntent`) apunten a `intent_id` existentes o recién creados.
6. **Aplicar** los cambios directamente al archivo con la herramienta Edit o Write.
7. **Confirmar** qué se cambió y cómo se prueba en Tiledesk (importar el archivo en Configuración → Chatbots → Importar).

Si el cambio implica un flujo de agente nuevo, crear siempre los 6 intents del patrón completo.

Si el usuario pide agregar texto que contenga una URL, escribirla como texto plano (no HTML), ya que el chat web de Tiledesk la convierte en enlace automáticamente.
