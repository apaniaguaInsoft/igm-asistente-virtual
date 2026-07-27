# IGM Web Asistente Virtual — Tiledesk Flow Guide

## Table of Contents
1. [File Overview](#file-overview)
2. [Root-Level Structure](#root-level-structure)
3. [Intent Object Structure](#intent-object-structure)
4. [Action Types Reference](#action-types-reference)
5. [Message & Button Types](#message--button-types)
6. [Flow Sections (by prefix)](#flow-sections-by-prefix)
7. [Color Coding System](#color-coding-system)
8. [How to Modify the File](#how-to-modify-the-file)
9. [Improvement Plan — Humanized Language & Expanded Flow](#improvement-plan--humanized-language--expanded-flow)

---

## File Overview

**File:** `IGM Web Asistente Virtual.json`  
**Total intents:** 107  
**Language:** Spanish (`"language": "es"`)  
**Type:** `tilebot` / `chatbot`  
**Platform:** Tiledesk

This file is the complete export of the IGM virtual assistant chatbot. It contains every conversation block ("intent"), the text messages sent to users, the buttons shown, and the routing logic between blocks. Importing this file into Tiledesk replaces the entire bot configuration.

---

## Root-Level Structure

```json
{
  "webhook_enabled": false,
  "language": "es",
  "name": "IGM Web Asistente Virtual",
  "slug": "igm-web-v1-3-1-2",
  "type": "tilebot",
  "subtype": "chatbot",
  "attributes": {
    "variables": { "result": "result", "status": "status", "error": "error" },
    "rules": []
  },
  "intents": [ /* array of all conversation blocks */ ]
}
```

| Field | Purpose |
|---|---|
| `name` | Display name shown in Tiledesk dashboard |
| `slug` | Unique identifier / version tag — update when publishing a new version |
| `attributes.variables` | Global variables available across the flow |
| `intents` | **The entire conversation logic lives here** — 107 blocks |

---

## Intent Object Structure

Each element inside `"intents"` represents a single conversation block (screen in the visual editor).

```json
{
  "webhook_enabled": false,
  "enabled": true,
  "actions": [ /* one or more action objects */ ],
  "intent_display_name": "psp_citas_nueva",
  "intent_id": "e0348097-843e-47e9-9978-6a4e66180745",
  "question": "nueva cita\ncita pasaporte",
  "language": "es",
  "attributes": {
    "position": { "x": 632, "y": -5078 },
    "readonly": false,
    "color": "86,179,101",
    "nextBlockAction": {
      "_tdActionId": "...",
      "_tdActionType": "intent",
      "intentName": "#7184a924-..."
    }
  },
  "agents_available": false
}
```

| Field | Purpose |
|---|---|
| `intent_display_name` | Human-readable block name (used as reference in this guide) |
| `intent_id` | UUID — never change this; all cross-references use it |
| `question` | Newline-separated NLU trigger phrases. Leave empty if the block is only reached via button click. |
| `actions` | Ordered list of things the bot does when this block is entered |
| `attributes.position` | X/Y coordinates in the visual canvas — cosmetic only |
| `attributes.color` | RGB color of the block card in the editor — cosmetic only |
| `attributes.nextBlockAction.intentName` | The block to go to after all actions finish (referenced as `#<intent_id>`) |
| `attributes.readonly` | `true` for system blocks (`defaultFallback`, `start`) that cannot be deleted |

---

## Action Types Reference

Actions execute in order when a user enters an intent block.

### `reply` / `replyv2`
Sends a text message to the user, optionally with buttons.

```json
{
  "_tdActionType": "reply",
  "attributes": {
    "disableInputMessage": false,
    "commands": [
      { "type": "wait", "time": 500 },
      {
        "type": "message",
        "message": {
          "type": "text",
          "text": "Your message here",
          "attributes": {
            "attachment": {
              "type": "template",
              "buttons": [ /* see Button Types */ ]
            }
          }
        }
      }
    ]
  },
  "noInputTimeout": 660000,
  "noInputIntent": "#dc484960-..."
}
```

- `disableInputMessage: false` — user can type a reply
- `noInputTimeout` — milliseconds before the inactivity block fires (660000 = 11 min)
- `noInputIntent` — which block to jump to on timeout (always `timeout_inactividad`)
- `replyv2` is identical to `reply` but also supports conditional message display via `_tdJSONCondition`

### `intent`
Immediately jumps to another block (no message sent).

```json
{
  "_tdActionType": "intent",
  "intentName": "#5c24130f-7a96-4760-a3dd-702ba95ab989"
}
```

### `wait`
Adds a delay in milliseconds (standalone action, not inside `commands`).

```json
{
  "_tdActionType": "wait",
  "millis": 500
}
```

### `ifopenhours`
Checks if the current time is within configured business hours and routes accordingly.

```json
{
  "_tdActionType": "ifopenhours",
  "stopOnConditionMet": true,
  "trueIntent": "#<block-if-open>",
  "falseIntent": "#<block-if-closed>",
  "slotId": null
}
```

### `ifonlineagentsv2`
Checks if any human agents are online in a given department and routes accordingly.

```json
{
  "_tdActionType": "ifonlineagentsv2",
  "selectedOption": "selectedDep",
  "ignoreOperatingHours": false,
  "trueIntent": "#<block-if-agents-available>",
  "falseIntent": "#<block-if-no-agents>",
  "selectedDepartmentId": "6a59554334e2f00013999e90"
}
```

### `department`
Assigns the conversation to a Tiledesk department (routes to human agents).

```json
{
  "_tdActionType": "department",
  "depName": "Default Department",
  "triggerBot": false
}
```

### `agent`
Transfers directly to a human agent (used in `send_to_agent`).

```json
{
  "_tdActionType": "agent"
}
```

---

## Message & Button Types

### URL Button
Opens a link in a new tab. Used for external resources (portal de citas, IGM website, etc.).

```json
{
  "uid": "unique-uid",
  "type": "url",
  "value": "Portal de Citas",
  "link": "https://servicios.igm.gob.gt/citasenlinea/",
  "target": "blank",
  "show_echo": true
}
```

### Action Button
Jumps to another intent block when clicked.

```json
{
  "uid": "unique-uid",
  "type": "action",
  "value": "🏠 Ir al menú",
  "action": "#5c24130f-7a96-4760-a3dd-702ba95ab989",
  "show_echo": true,
  "alias": "menu, inicio, volver, regresar"
}
```

**`alias` field:** A comma-separated list of keywords or phrases the user might type to trigger this button via NLU. Tiledesk uses these to match free-text input to the correct option when the user types instead of clicking. Always fill this in for menu buttons so the bot can understand typed messages.

Examples by button type:
| Button label | alias value |
|---|---|
| 📋 Tramitar o renovar (adultos) | `tramitar, renovar, pasaporte adulto, nuevo pasaporte` |
| 📅 Citas y reprogramación | `cita, citas, agendar, reprogramar, cambiar cita` |
| 👦 Pasaporte para menores de edad | `menor, niño, niña, hijo, hija, menores` |
| 🚨 Pérdida, robo o deteriorado | `perdi, robo, robaron, extraviado, deteriorado` |
| 🏠 Menú principal | `menu, inicio, volver, regresar, empezar` |
| ⬅️ Volver a Pasaportes | `volver, regresar, pasaportes` |

> **Important:** `uid` values must be unique across the entire file. When duplicating a button, generate a new random hex string for `uid`.

---

## Flow Sections (by prefix)

The 107 intents are organized by naming prefix, which maps to the main menu categories.

### System / Global (no prefix)

| Intent name | Purpose |
|---|---|
| `start` | Entry point — triggers `bienvenida` |
| `bienvenida` | Welcome message → goes to `menu_principal` |
| `menu_principal` | Main menu with 6 category buttons |
| `defaultFallback` | Catches unrecognized input → offers return to menu |
| `timeout_inactividad` | Fires after 11 min of inactivity → closes chat |
| `agentes_menu` | Standalone "talk to an agent" shortcut |
| `send_to_agent` | Final transfer action to a human agent |

### `psp_` — Pasaportes (27 intents)

Main flow: `pasaportes_menu` → tramitar / citas / menores / extras

| Sub-group | Intents |
|---|---|
| Menu | `pasaportes_menu`, `psp_citas_menu`, `psp_tramitar_adultos_menu`, `psp_menores_menu` |
| Tramitar pasaporte | `psp_tramitar_requisitos_cita`, `psp_tramitar_pasta_roja`, `psp_tramitar_extraviado` |
| Citas | `psp_citas_nueva`, `psp_citas_reprogramar`, `psp_citas_no_disponibles` |
| Menores | `psp_menores_ambos_padres`, `psp_menores_un_padre_gt`, `psp_menores_padre_extranjero`, `psp_menores_judicial` |
| Otros | `psp_pasaporte_extranjero`, `psp_extension_vigencia`, `psp_requisitos_costos`, `psp_devolucion_pago`, `psp_perdida_robo_deteriorado` |
| Agent handoff | `check_horario_Pasaportes`, `check_agentes_Pasaportes`, `agente_disp_Pasaportes`, `agente_no_disp_Pasaportes`, `fuera_horario_Pasaportes`, `send_dept_Pasaportes`, `psp_regresar` |

### `ext_` — Extranjería (18 intents)

Main flow: `extranjeria_menu` → visas / residencias / notificación / garantes

| Sub-group | Intents |
|---|---|
| Menu | `extranjeria_menu`, `ext_paises_visas_menu`, `ext_residencias_menu` |
| Visas | `ext_categoria_a`, `ext_categoria_bc_consular`, `ext_categoria_c_consultada` |
| Residencias | `ext_residencia_temporal`, `ext_residencia_permanente`, `ext_residencia_matrimonio`, `ext_residencia_hijo_guatemalteco`, `ext_residencia_duracion`, `ext_cuota_anual` |
| Otros | `ext_prorroga_estadia`, `ext_notificacion_previo`, `ext_garantes_guatemaltecos` |
| Agent handoff | `check_horario_Extranjeria`, `check_agentes_Extranjeria`, `agente_disp_Extranjeria`, `agente_no_disp_Extranjeria`, `fuera_horario_Extranjeria`, `send_dept_Extranjeria`, `ext_regresar` |

### `ctrl_` — Control Migratorio (16 intents)

Main flow: `control_migratorio_menu` → arraigos / menores / movimientos / multas / otros

| Sub-group | Intents |
|---|---|
| Menu | `control_migratorio_menu`, `ctrl_arraigos_menu`, `ctrl_menores_viajando_menu` |
| Arraigos | `ctrl_arraigo_consulta`, `ctrl_arraigo_certificacion` |
| Menores viajando | `ctrl_menor_ambos_padres`, `ctrl_menor_con_un_padre`, `ctrl_menor_viaja_solo` |
| Otros | `ctrl_requisitos_salida`, `ctrl_movimientos_migratorios`, `ctrl_multas_estadia`, `ctrl_estatus_bancario`, `ctrl_registro_ingreso`, `ctrl_apostilla` |
| Agent handoff | `check_horario_ControlMigratorio`, `check_agentes_ControlMigratorio`, `agente_disp_ControlMigratorio`, `agente_no_disp_ControlMigratorio`, `fuera_horario_ControlMigratorio`, `send_dept_ControlMigratorio`, `ctrl_regresar` |

### `info_` — Información General (8 intents)

| Intent | Purpose |
|---|---|
| `info_general_menu` | Sub-menu for general information |
| `info_ubicaciones_horarios` | Office locations and hours |
| `info_solicitud_refugio` | Refugee application info |
| `info_viajeros_centroamericanos` | Central American travelers (no passport) |
| `info_empleo_igm` | Job applications at IGM |
| `info_legalizacion_firma` | Signature legalization |
| `info_preguntas_frecuentes` | FAQ redirect |
| `info_regresar` | Return to main menu |
| Agent handoff | `check_horario_InformacionGeneral`, `check_agentes_InformacionGeneral`, `agente_disp_InformacionGeneral`, `agente_no_disp_InformacionGeneral`, `fuera_horario_InformacionGeneral`, `send_dept_InformacionGeneral` |

### `prh_` — Plan Retorno al Hogar (10 intents)

| Intent | Purpose |
|---|---|
| `prh_menu` | PRH section entry point |
| `prh_preguntas_frecuentes_menu` | FAQ sub-menu |
| `prh_faq_car` | What is a CAR? |
| `prh_faq_empleo` | Employment support |
| `prh_faq_hijos` | Children's documentation |
| `prh_faq_dpi_pertenencias` | DPI and belongings |
| `prh_faq_emergencias` | Emergency support |
| `prh_faq_pasaporte` | Passport renewal for returnees |
| `prh_faq_transporte` | Transportation info |
| `prh_faq_familiar` | Family reunification |
| Agent handoff | `check_horario_PRH`, `check_agentes_PRH`, `agente_disp_PRH`, `agente_no_disp_PRH`, `fuera_horario_PRH`, `send_dept_PRH`, `prh_regresar_faq` |

---

## Color Coding System

Colors are cosmetic only (they style the block card in the Tiledesk editor) but serve as a useful visual map.

| RGB Value | Category |
|---|---|
| `80,100,147` (blue-gray) | System blocks: `start`, `bienvenida`, `menu_principal`, `defaultFallback`, `timeout_inactividad` |
| `86,179,101` (green) | Pasaportes (`psp_*`) |
| `0, 179, 119` / `0, 179, 134` / `0, 179, 143` (teal) | Transfer/handoff blocks (`check_*`, `send_dept_*`, `agente_disp_*`, `agente_no_disp_*`) |
| `179, 140, 0` (gold) | Control Migratorio (`ctrl_*`) |
| `56, 142, 60` (dark green) | Plan Retorno al Hogar (`prh_*`) |
| `0, 179, 98` / `0, 179, 119` (cyan-green) | Información General / Extranjería out-of-hours |

---

## How to Modify the File

### Safe changes (text only)

To update a message the bot sends, find the intent by `intent_display_name` and edit the `"text"` field inside its `commands` array:

```json
// Before
"text": "¿En qué puedo ayudarle hoy?\n\nSelecciona una opción:"

// After
"text": "¡Hola! ¿En qué te puedo ayudar hoy? 😊\n\nElige una opción:"
```

No other fields need to change when only editing message text.

### Adding a new button to an existing screen

Find the intent, locate its `buttons` array, and add a new object. **Always generate a fresh `uid`** (random 32-char hex string):

```json
{
  "uid": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
  "type": "action",
  "value": "📄 Nueva opción",
  "link": "",
  "target": "blank",
  "action": "#<target-intent-id>",
  "attributes": "",
  "show_echo": true,
  "alias": ""
}
```

### Adding a completely new intent block

1. Copy an existing intent object of the same type (info block, menu block, etc.)
2. Generate a new UUID for `"intent_id"` (e.g., using `uuidgen` in terminal or an online generator)
3. Change `"intent_display_name"` to something meaningful using the appropriate prefix
4. Update `"text"` with the new message
5. Update `"buttons"` as needed
6. Set `"attributes.nextBlockAction.intentName"` to the `#<intent_id>` of the block that should follow
7. Add a button in the **parent** block that points to `"#<new-intent-id>"`

### Updating the version slug

When publishing a new version, update the root `"slug"` field to reflect the new version:

```json
"slug": "igm-web-v2-0-0"
```

### Importing into Tiledesk

In Tiledesk: **Settings → Bots → Import Bot** → upload the JSON file. This replaces the entire bot. There is no merge — always export and back up the current version first.

---

## Improvement Plan — Humanized Language & Expanded Flow

### Goals
1. Replace robotic, form-style language with conversational, warm Spanish
2. Split dense information blocks into smaller, easier-to-navigate steps
3. Add missing sub-categories where users frequently need more detail

> **Register requirement:** All messages must use **usted** (formal) consistently. The IGM is a government institution — formal register is a client requirement. Use "le", "su", "sus", "usted". Never "tú", "te", "tu", "tus" when addressing the user.

---

### Phase 1 — Language Rewrite

These are the highest-priority message rewrites. The current text reads like a printed brochure; the goal is to feel like a knowledgeable IGM staff member helping you.

#### Global blocks

| Block | Current text | Proposed text |
|---|---|---|
| `menu_principal` | `¿En qué puedo ayudarle hoy?\n\nSelecciona una opción:` | `¡Hola! Estoy aquí para ayudarte. ¿Qué necesitas hoy? 😊` |
| `defaultFallback` | `Disculpa, no he entendido tu mensaje. Puedes regresar al menú principal.` | `No entendí bien lo que escribiste, pero no te preocupes. Podemos empezar de nuevo desde el menú principal 👇` |
| `timeout_inactividad` | `No hubo respuesta por más de 10 minutos, se cerró el chat automáticamente.` | `Parece que te fuiste un momento — cerré el chat para mantener el espacio disponible. ¡Vuelve cuando quieras, estamos aquí! 😊` |
| `bienvenida` | `¡Bienvenido al Instituto Guatemalteco de Migración! Soy el asistente virtual del IGM.` | `¡Bienvenido/a al IGM! 👋 Soy el asistente virtual y estoy listo para ayudarte con tus trámites migratorios.` |

#### Pasaportes blocks

| Block | Issue | Proposed fix |
|---|---|---|
| `psp_citas_nueva` | Bullet list feels like a checklist form | Rewrite as step-by-step narrative: "Para agendar tu cita, solo necesitas seguir estos pasos: primero, realiza tu pago en Banrural…" |
| `psp_tramitar_requisitos_cita` | Title "Requisitos para el día de la cita" is abrupt | Lead with context: "Para el día de tu cita en el IGM, asegúrate de llevar lo siguiente:" |
| `psp_menores_un_padre_gt` | "Un padre no puede asistir (dentro de GT)" is very terse | "Si uno de los padres no puede ir ese día pero está en Guatemala, puede autorizar a otra persona con los siguientes documentos:" |
| `psp_pasaporte_extranjero` | "Puede consultar con el consulado guatemalteco más cercano" — cold and dismissive | "Si estás en el extranjero y necesitas tramitar tu pasaporte, el consulado guatemalteco más cercano puede ayudarte. Aquí tienes toda la información:" |
| `psp_perdida_robo_deteriorado` | No context or empathy | Add opening: "Sabemos que perder o que te roben el pasaporte es frustrante. Aquí te decimos cómo proceder:" |

#### Extranjería blocks

| Block | Issue | Proposed fix |
|---|---|---|
| `ext_categoria_c_consultada` | "Tramitada por garante guatemalteco en el IGM. Costo: USD 25.00. Presencial." — reads like a database record | "La Visa Categoría C se tramita de forma presencial en el IGM, con el apoyo de un garante guatemalteco. El costo es de USD 25.00. Aquí tienes los formularios que necesitas:" |
| `ext_residencia_temporal` | Bullet list of documents with no context | Add intro: "Para solicitar residencia temporal necesitas presentar estos documentos en el IGM:" |
| `ext_garantes_guatemaltecos` | Dense legal language | Split into two messages: what a garante is, then what documents they need |

#### Agent handoff blocks

| Block | Issue | Proposed fix |
|---|---|---|
| `fuera_horario_InformacionGeneral` | Long paragraph with embedded schedule and WhatsApp number | Shorten the main message; put contact info in a dedicated button block |
| `agente_no_disp_Pasaportes` | Abrupt "no hay agentes disponibles" | "Todos nuestros agentes están ocupados en este momento. Puedes seguir explorando información aquí o intentar nuevamente en unos minutos 👇" |
| `agente_disp_*` (all departments) | Generic "transfiriendo" message | Personalize per department: "Estoy conectándote con un especialista en Pasaportes. Solo un momento… 🔄" |

---

### Phase 2 — New Blocks & Flow Expansions

These are new intent blocks to create, targeting areas where the current flow is too compressed.

#### 2.1 Pasaportes — Expand "Tramitar" into separate adult vs. renewal

Current flow: `psp_tramitar_adultos_menu` → jumps to requirements immediately.

**Proposed addition:**
```
psp_tramitar_adultos_menu
  ├── psp_tramitar_por_primera_vez    [NEW] First-time applicants — emphasize they need a cita
  └── psp_tramitar_renovacion         [NEW] Renewal — shorter list, mention bringing old passport
```

Both blocks then lead to `psp_tramitar_requisitos_cita`.

#### 2.2 Pasaportes — Separate "Cambio de datos" as its own sub-topic

Currently buried in `psp_requisitos_costos`. Add:

```
psp_tramitar_adultos_menu
  └── psp_tramitar_cambio_datos       [NEW] Name change, DPI correction, etc.
```

#### 2.3 Control Migratorio — Expand "Multas por estadía"

Current `ctrl_multas_estadia` is a single text block. Expand to:

```
ctrl_multas_estadia                   (existing — add button choices)
  ├── ctrl_multas_calculo             [NEW] How fines are calculated
  ├── ctrl_multas_pago                [NEW] Where and how to pay
  └── ctrl_multas_exoneracion         [NEW] Exemption cases (e.g., minors, emergencies)
```

#### 2.4 Extranjería — "Prórrogas de estadía" needs more detail

Current `ext_prorroga_estadia` is one block. Expand:

```
ext_prorroga_estadia                  (existing — add button choices)
  ├── ext_prorroga_requisitos         [NEW] Document list for the extension
  ├── ext_prorroga_costo_plazo        [NEW] Cost and timeline
  └── ext_prorroga_limite             [NEW] Maximum number of extensions allowed
```

#### 2.5 PRH — Add "Sobre el programa" intro block

Currently `prh_menu` jumps straight to FAQs. Add an intro:

```
prh_menu
  ├── prh_que_es_el_programa          [NEW] Brief explanation of the Plan Retorno al Hogar
  └── prh_preguntas_frecuentes_menu   (existing)
```

#### 2.6 Información General — Add "Verificar estado de trámite"

A common question not currently covered. Add:

```
info_general_menu
  └── info_estado_tramite             [NEW] How to check the status of a pending procedure
                                             (with a link to the official portal and a contact option)
```

---

### Phase 3 — Slug & Metadata

When the new version is ready, update the root `"slug"` to reflect the new version number:

```json
"slug": "igm-web-v2-0-0"
```

Export the current bot from Tiledesk before importing the new file.

---

### Implementation Checklist

- [ ] Back up current export from Tiledesk
- [ ] Rewrite all Phase 1 messages (global blocks first, then per-section)
- [ ] Create new intent objects for Phase 2 blocks (generate fresh UUIDs)
- [ ] Add new buttons in parent menus pointing to the new blocks
- [ ] Set correct `nextBlockAction` in each new block (usually → the section's "regresar" block)
- [ ] Update `"slug"` to `igm-web-v2-0-0`
- [ ] Import into Tiledesk staging environment and test all paths
- [ ] Verify all agent-handoff paths still route correctly
- [ ] Test `defaultFallback` and `timeout_inactividad` behavior
- [ ] Import into production
