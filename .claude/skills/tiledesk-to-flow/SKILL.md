---
name: tiledesk-to-flow
description: >
  Converts a Tiledesk chatbot export (JSON) into the IGM Flow tree format used
  as DEFAULT_FLOW in api/flow.js. Trigger whenever the user wants to: transform
  or import a Tiledesk JSON, convert "IGM Web Asistente Virtual.json" to the
  editable flow format, sync the live Tiledesk bot with the flow visualizer, or
  update DEFAULT_FLOW from a Tiledesk export. Also trigger for phrases like
  "convertir el JSON de Tiledesk", "importar el bot", "transformar el JSON al
  formato del flujo", or "actualizar DEFAULT_FLOW desde Tiledesk".
---

# Tiledesk → IGM Flow Converter

## What this skill does

Runs a bundled Python script that reads a Tiledesk export JSON and converts
it into the recursive tree format that `api/flow.js` uses as `DEFAULT_FLOW`.

**Input**: any Tiledesk JSON file (flat list of ~100+ `intents` linked by UUIDs)  
**Output**: a JSON file with a recursive tree of nodes with `id`, `label`, `type`,
`cat`, `intents`, `detail`, `children` — ready to paste as `DEFAULT_FLOW` or
POST to `/api/flow/versions` to publish as a new version.

## How to run the conversion

The script is at:
```
.claude/skills/tiledesk-to-flow/scripts/convert.py
```

Run it with:
```bash
python3 .claude/skills/tiledesk-to-flow/scripts/convert.py \
  "IGM Web Asistente Virtual.json" \
  converted_flow.json
```

Or print to stdout:
```bash
python3 .claude/skills/tiledesk-to-flow/scripts/convert.py "IGM Web Asistente Virtual.json"
```

## What the script does

1. **Finds the root**: locates `bienvenida` + `menu_principal` intents and
   merges their welcome text + button list into the root node (id `"1"`).

2. **Traverses the graph**: follows button `action` references recursively,
   building a tree. Skips back-navigation buttons (`Volver`, `Ir al menú`, etc.)
   and detects cycles via an ancestor-path set.

3. **Maps node types**:
   | Tiledesk action type | Flow node type |
   |---|---|
   | `replyv2`/`reply` + has buttons | `menu` |
   | `replyv2`/`reply` + no buttons | `final` |
   | `ifopenhours` | `check` |
   | `ifonlineagentsv2` | `check` |
   | `department` / `agent` | `transfer` |
   | name contains `fuera_horario` / `no_disp` | `offline` |

4. **Detects agentSubflow pattern**: automatically maps the 3-step
   `check_horario → check_agentes → send_dept` chain into:
   - `check` → (offline: fuera de horario)
   - `check` → (offline: sin agentes) + (transfer: agente disponible)

5. **Infers categories** from intent display names:
   | Pattern | `cat` |
   |---|---|
   | `psp_*`, `pasaporte*` | `pasaportes` |
   | `ext_*`, `extranjeria*` | `extranjeria` |
   | `ctrl_*`, `control_*` | `control` |
   | `info_*`, `prh_*`, `refugio`, `retorno` | `info` |
   | Everything else | inherits parent's `cat` |

6. **Extracts intents** from the Tiledesk `question` field (newline-separated
   phrases) plus button `alias` fields.

## After conversion

The output `converted_flow.json` is the new `DEFAULT_FLOW` tree.

**Option A — Update code** (takes effect after `POST /api/flow/reset`):
Paste the JSON as the value of `DEFAULT_FLOW` in `api/flow.js`.

**Option B — Publish directly** (takes effect immediately):
```bash
curl -X POST https://<your-deployment>/api/flow/versions \
  -H "Content-Type: application/json" \
  -H "x-admin-token: $ADMIN_TOKEN" \
  -d "{\"flow\": $(cat converted_flow.json), \"label\": \"Import from Tiledesk\"}"
```

Or do it through the `/admin` UI: log in, paste the JSON into the editor, and click Publicar.

## Manual review after conversion

Things to check after running the script:
- **Labels**: the root-level children get their label from the Tiledesk button text.
  You may want to shorten or reformat them.
- **detail text**: Tiledesk uses plain text with `\n` breaks. The flow editor
  renders this as-is. Any links appear as plain URLs (no `L()` helper wrapping).
- **Category colors**: verify `cat` values match the CSS vars in `public/`.
  Extra categories like `prh` may need a new color variable.
- **agentSubflow nodes**: the converter keeps the full Tiledesk message text
  for these nodes. You may want to slim them down to match the standard template.
