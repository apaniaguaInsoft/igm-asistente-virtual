---
name: tiledesk-paginated-menus
description: Guía para crear o ampliar menús paginados en el JSON de Tiledesk del bot IGM. Úsala siempre que el usuario quiera agregar una nueva categoría con varias opciones, dividir un menú existente en páginas, agregar más opciones a Pasaportes o Plan Retorno al Hogar, crear un submenú paginado, o preguntar cómo estructurar un menú con muchas opciones. También actívala para frases como "nueva sección", "más opciones", "agregar página", "paginar menú", "nueva categoría con submenús", "cómo agrego más opciones al bot".
---

# Menús paginados en el bot IGM (Tiledesk)

Cuando una categoría tiene más opciones de las que caben cómodamente en pantalla (más de 4-5 temas), se divide el menú en páginas. Cada página es un bloque `replyv2` separado con botones de navegación entre páginas.

Los ejemplos reales en el bot son **Pasaportes** (2 páginas) y **Plan Retorno al Hogar** (1 menú principal + 3 páginas de FAQ). Antes de crear algo desde cero, busca esos bloques en el JSON como referencia. Lee `references/ejemplos-reales.md` para ver sus estructuras completas.

## Cuándo paginar

- Más de 5 temas/opciones en una categoría → dividir en páginas de 4 opciones cada una
- Menos de 5 opciones → un solo menú sin paginación
- Siempre reservar espacio al final para: botón "Ver más" / navegación + botón agente (si aplica) + botón "Menú principal"

---

## Convención de nombres

| Elemento | Patrón | Ejemplo Pasaportes | Ejemplo PRH |
|---|---|---|---|
| Menú pág. 1 | `{cat}_menu` | `pasaportes_menu` | `prh_menu` |
| Menú pág. 2 | `{cat}_menu_p2` o nombre descriptivo | `pasaportes_menu_p2` | `prh_preguntas_frecuentes_menu` |
| Menú pág. 3+ | nombre descriptivo | — | `prh_faq_car_reintegracion` |
| Regresar pág. 1 | `{cat}_regresar` | `psp_regresar` | `prh_regresar_faq` |
| Regresar pág. 2+ | `volver_{cat}_p{N}` | `psp_regresar_p2` | `volver_prh_p2`, `volver_prh_p3` |

---

## Estructura de botones por página

### Página 1
```
[Opción 1]  [Opción 2]  [Opción 3]  [Opción 4]
[➕ Ver más opciones]
[🧑‍💼 Hablar con agente]   (solo si la categoría tiene agentes)
[🏠 Menú principal]
```

### Páginas intermedias (2, 3, ...)
```
[Opción A]  [Opción B]  [Opción C]  [Opción D]
[➕ Ver más opciones]
[⬅️ Regresar al menú anterior]
[🏠 Menú principal]
```

### Última página
```
[Opción X]  [Opción Y]
[⬅️ Regresar al menú anterior]
[🏠 Menú principal]
```

---

## Template JSON para una página de menú

Todos los menús de navegación usan `_tdActionType: "replyv2"`. Los campos clave que NO deben omitirse:

```json
{
  "webhook_enabled": false,
  "enabled": true,
  "actions": [
    {
      "_tdActionTitle": "",
      "_tdActionId": "NUEVO_HEX_32_CHARS",
      "_tdActionType": "replyv2",
      "attributes": {
        "disableInputMessage": false,
        "commands": [
          { "type": "wait", "time": 500 },
          {
            "type": "message",
            "message": {
              "type": "text",
              "text": "EMOJI **Categoría › Subtítulo**\n\n¿Qué información necesita?",
              "attributes": {
                "attachment": {
                  "type": "template",
                  "buttons": [
                    {
                      "uid": "NUEVO_HEX_32",
                      "type": "action",
                      "value": "EMOJI Opción visible",
                      "link": "",
                      "target": "blank",
                      "action": "#intent-id-del-destino",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "palabras clave separadas por comas"
                    }
                  ],
                  "json_buttons": ""
                }
              }
            }
          }
        ]
      },
      "noInputTimeout": 660000,
      "noInputIntent": "#dc484960-3cb4-4198-9d3a-24afef961603"
    }
  ],
  "intent_display_name": "nombre_del_bloque",
  "intent_id": "NUEVO-UUID-v4",
  "language": "es",
  "attributes": {
    "position": { "x": 0, "y": 0 },
    "readonly": false,
    "color": "80,100,147",
    "nextBlockAction": {
      "_tdActionId": "NUEVO_HEX_32",
      "_tdActionType": "intent",
      "intentName": null
    }
  },
  "agents_available": false
}
```

---

## Template JSON para un bloque regresar

```json
{
  "_tdActionType": "replyv2",
  "attributes": {
    "commands": [
      { "type": "wait", "time": 500 },
      {
        "type": "message",
        "message": {
          "type": "text",
          "text": "📌 **¿En qué más le puedo ayudar?**",
          "attributes": {
            "attachment": {
              "type": "template",
              "buttons": [
                {
                  "uid": "NUEVO_HEX_32",
                  "type": "action",
                  "value": "⬅️ Volver a [Categoría (página N)]",
                  "link": "",
                  "target": "blank",
                  "action": "#intent-id-de-esa-pagina",
                  "attributes": "",
                  "show_echo": true,
                  "alias": "volver, regresar, anterior"
                },
                {
                  "uid": "NUEVO_HEX_32",
                  "type": "action",
                  "value": "🏠 Ir al menú principal",
                  "link": "",
                  "target": "blank",
                  "action": "#5c24130f-7a96-4760-a3dd-702ba95ab989",
                  "attributes": "",
                  "show_echo": true,
                  "alias": "menú, inicio, principal"
                }
              ],
              "json_buttons": ""
            }
          }
        }
      }
    ]
  },
  "noInputTimeout": 660000,
  "noInputIntent": "#dc484960-3cb4-4198-9d3a-24afef961603"
}
```

---

## Checklist antes de insertar en el JSON

- [ ] UUID único para `intent_id` de cada bloque nuevo (formato `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
- [ ] HEX de 32 chars único para cada `_tdActionId` y cada `uid` de botón
- [ ] Botón "➕ Ver más opciones" en todas las páginas EXCEPTO la última
- [ ] Botón "⬅️ Regresar al menú anterior" en todas las páginas EXCEPTO la primera
- [ ] Un bloque `volver_*` (regresar) por cada página
- [ ] Los bloques informativos (`reply`) de esa categoría tienen `noInputIntent` apuntando al bloque regresar de su página
- [ ] El menú padre de la categoría tiene un botón que llega al nuevo menú pág. 1

---

## IDs fijos del bot (no recrear)

| Bloque | intent_id |
|---|---|
| Menú principal (root) | `5c24130f-7a96-4760-a3dd-702ba95ab989` |
| Timeout inactividad | `dc484960-3cb4-4198-9d3a-24afef961603` |
| Pasaportes menú p1 | `b8fc2220-888f-44f6-aa25-37b85f4639f4` |
| Pasaportes menú p2 | `2b5af009-6289-45b4-b780-9b5f44ef70fd` |
| PRH menú | `e75d9625-ac81-428e-8ea4-c287ba122972` |
| PRH FAQ p2 | `8ffbe129-54d4-4320-a8a1-9d29a1fd2dcd` |
| PRH FAQ p3 | `e56e9394-0d11-41ec-a378-a7ebc71caeeb` |
| PRH FAQ p4 | `992a87cc-17e3-44ef-9c09-5f5cbeba4a68` |
| Extranjería menú | `03a25a50-1ccb-4d79-b78e-174374e72e11` |
| Control Migratorio menú | `8d434dfb-bd6f-411f-aec4-3fc5f65395ab` |
| Información General menú | `c835acc9-6c9c-4223-a4a6-950cc2c88593` |

---

## Reglas de estilo heredadas

Estas reglas se establecieron en el desarrollo del bot y deben respetarse siempre:

- Menús de navegación → `replyv2` (únicos advance reply del bot)
- Respuestas informativas → `reply` (sin `noInputTimeout`)
- Los submenús SÍ llevan botón "⬅️ Volver a [categoría]" (no son respuestas finales)
- Los bloques informativos NO llevan botón "Volver a" (el usuario regresa vía el bloque regresar)
- Siempre **usted** (formal) en todos los textos
