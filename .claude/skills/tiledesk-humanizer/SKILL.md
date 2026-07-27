---
name: tiledesk-humanizer
description: Rewrites and improves the IGM Tiledesk chatbot JSON to use warm, conversational Spanish instead of robotic, form-style language. Use this skill whenever the user wants to humanize bot messages, apply the improvement plan, create a new version of the chatbot, rewrite bot responses to sound more natural, update specific blocks in the Tiledesk flow, or make the IGM virtual assistant sound friendlier. Also trigger for requests like "lenguaje más humano", "mensajes más naturales", "actualizar el flujo del bot", "nueva versión del asistente", "reescribir mensajes", or "mejorar el chatbot". If the user asks to apply Phase 1 or Phase 2 of the improvement plan, this skill covers both.
---

# IGM Tiledesk Flow Humanizer

You're rewriting the IGM Tiledesk virtual assistant to sound like a friendly, knowledgeable IGM staff member — not a bureaucratic form or a printed checklist. The bot currently uses abrupt headings as messages ("Requisitos para el día de la cita") and drops information on users without context or empathy.

**Critical register rule:** The bot must always use **usted** (formal Spanish). This is a client requirement — the IGM is a government institution and must maintain a respectful, formal register. Never use "tú", "te", "tu", or "tus" to address the user. Use "usted", "le", "su", "sus" consistently.

## Before you start

1. Read `TILEDESK_FLOW_GUIDE.md` — it contains the full structure map and the specific improvement plan (Phases 1, 2, and 3). Pay special attention to the "Phase 1 — Language Rewrite" and "Phase 2 — New Blocks" tables.
2. Read `references/rewrite-rules.md` in this skill directory — it has detailed rewriting principles and all the concrete block-level changes.
3. Ask the user which scope they want:
   - **Phase 1 only**: rewrite existing messages (faster, safer)
   - **Phase 1 + Phase 2**: also add new intent blocks (more complete)
   - **Specific block(s)**: rewrite only what the user names

## Working with the JSON

The bot lives in `IGM Web Asistente Virtual.json`. It's ~7,000 lines. To find a specific block, search by `"intent_display_name": "<name>"`. The message text is always inside:

```
actions[N].attributes.commands[N].message.text
```

**Never change:**
- `intent_id` values — every cross-reference in the file uses these
- `uid` values on buttons (unless you're duplicating a button, in which case generate a new random 32-char hex string)
- `_tdActionId` values
- `_tdActionType` values
- Button `action` values (they're `#<intent_id>` references)
- `attributes.readonly: true` blocks (`defaultFallback`, `start`)

**Safe to change:**
- The `"text"` field inside `message.text`
- Button `"value"` labels (the display text the user sees)
- The `"question"` field (NLU trigger phrases)
- `"intent_display_name"` (only rename if creating a new block)
- `"slug"` at the root level when releasing a new version

## Applying changes

When making targeted text changes, use the Edit tool with exact `old_string` → `new_string` matching. For the `"text"` fields, the full string including `\n` newlines must match exactly.

For Phase 2 (new blocks), copy an existing intent of the same type, then:
1. Run `uuidgen` in the terminal to get a fresh UUID for `intent_id`
2. Run `uuidgen | tr '[:upper:]' '[:lower:]' | tr -d '-'` for each new button `uid`
3. Update `intent_display_name`, `"text"`, buttons, and `nextBlockAction.intentName`
4. Add a button pointing to the new block's `#<intent_id>` in its parent menu block

After all changes, update the root `"slug"` to the next version (e.g., `"igm-web-v2-0-0"`).

## Validating the output

After edits, run:
```bash
python3 -c "import json; json.load(open('IGM Web Asistente Virtual.json')); print('JSON válido ✓')"
```

If it fails, the JSON is malformed — find and fix the syntax error before continuing.

## Output

Tell the user:
- Which blocks were changed and what was rewritten
- Which new blocks were added (Phase 2)
- The new slug value
- That they should back up the current Tiledesk export before importing the updated file
