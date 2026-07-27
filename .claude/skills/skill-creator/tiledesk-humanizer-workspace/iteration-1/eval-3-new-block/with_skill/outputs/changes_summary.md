# Changes Summary — Phase 2 eval-3-new-block

## Task
Add the new intent block `psp_tramitar_por_primera_vez` as specified in rewrite-rules.md section 2.1.

## Changes Made

### 1. New intent block added (end of `intents` array)

**`intent_display_name`**: `psp_tramitar_por_primera_vez`  
**`intent_id`**: `dbc74621-72e7-4f89-86aa-ee0e7ffd05dd`  
**`_tdActionId`** (reply action): `30061429bf2b440990b3f0b45aead9a0`  
**`nextBlockAction._tdActionId`**: `6658972920684acea3dd1221419def1f`  
**`nextBlockAction.intentName`**: `#540e1cc5-fb12-450b-8e54-68b6567bbbdf` (→ `psp_tramitar_requisitos_cita`)  
**`color`**: `86,179,101`  
**`position`**: x=900, y=-7800  
**File location**: line 7035–7088 of the output JSON

**Message text**:
```
🆕 ¿Es tu primera vez tramitando un pasaporte guatemalteco? Aquí te explicamos el proceso completo:

1️⃣ Agenda tu cita en el Portal de Citas
2️⃣ Realiza el pago en Banrural
3️⃣ Preséntate con tus documentos el día de la cita

El tiempo de entrega es de aproximadamente 15 días hábiles.
```

### 2. New button added in `psp_tramitar_adultos_menu`

**Button `uid`**: `20555d24089249ee83a404f68f415c34`  
**Button `value`**: `🆕 Primera vez tramitando`  
**Button `action`**: `#dbc74621-72e7-4f89-86aa-ee0e7ffd05dd`  
**Position**: inserted before the existing `⬅️ Volver a Pasaportes` button (4th of 5 total buttons)

**Full button order in `psp_tramitar_adultos_menu` after change**:
1. 📋 Requisitos para el día de la cita → `#540e1cc5-fb12-450b-8e54-68b6567bbbdf`
2. 🚨 Perdí o me robaron el pasaporte anterior → `#772212ba-fd10-4285-804e-1713d49a9ee7`
3. 📕 Pasaporte anterior de pasta roja → `#7adcce26-fb57-4a6d-99bb-3c898a247df0`
4. 🆕 Primera vez tramitando → `#dbc74621-72e7-4f89-86aa-ee0e7ffd05dd` ← NEW
5. ⬅️ Volver a Pasaportes → `#b8fc2220-888f-44f6-aa25-37b85f4639f4`

## IDs Preserved (unchanged)
- `psp_tramitar_requisitos_cita` intent_id: `540e1cc5-fb12-450b-8e54-68b6567bbbdf`
- `psp_tramitar_adultos_menu` intent_id: `b81aa876-44c2-4a84-b797-e5a4540d9db7`
- All existing button UIDs in `psp_tramitar_adultos_menu` unchanged

## Validation
- JSON structure verified manually (file ends with correct `}` closing)
- New block appended as last element of `intents` array (line 7035)
- New button correctly references the new block's intent_id
- `nextBlockAction` on new block correctly points to `psp_tramitar_requisitos_cita`
- `readonly: false` — block is editable
- `noInputIntent` set to `#dc484960-3cb4-4198-9d3a-24afef961603` (standard timeout intent)
