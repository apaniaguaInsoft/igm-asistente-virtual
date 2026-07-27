# Changes Summary — New Block: psp_tramitar_por_primera_vez

## What was created

A new Tiledesk intent block was added for first-time passport applicants.

### New intent block

- **intent_display_name**: `psp_tramitar_por_primera_vez`
- **intent_id**: `e7f3a1b2-c3d4-e5f6-a7b8-c9d0e1f2a3b4`
- **Position**: x: 900, y: -7800
- **Color**: `86,179,101` (green, matching the passport flow)
- **Language**: `es`

#### Message text

```
Para tramitar tu pasaporte por primera vez necesitas:

1. Agendar una cita
2. Pagar en Banrural
3. Presentar documentos el día de la cita
```

#### nextBlockAction (after message)

Routes back to `psp_tramitar_requisitos_cita` (`#540e1cc5-fb12-450b-8e54-68b6567bbbdf`), so the user sees the appointment requirements right after reading the first-time overview.

---

## What was modified

### psp_tramitar_adultos_menu

A new button was added to the existing button list, inserted before the "⬅️ Volver a Pasaportes" back-button:

| Field | Value |
|---|---|
| uid | `a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4` |
| value | `Primera vez tramitando` |
| action | `#e7f3a1b2-c3d4-e5f6-a7b8-c9d0e1f2a3b4` |
| type | `action` |
| show_echo | `true` |

The button routes the user into the new `psp_tramitar_por_primera_vez` block when tapped.

---

## Validation result

- `psp_tramitar_por_primera_vez` present in intents: **True**
- Total intents after change: **108** (was 107)
- JSON parses without errors: **True**
