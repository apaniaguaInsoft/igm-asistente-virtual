# Ejemplos reales de menús paginados (del JSON actual)

Este archivo muestra los bloques reales de Pasaportes y Plan Retorno al Hogar para que sirvan como referencia al crear nuevos menús paginados.

---

## PASAPORTES

### `pasaportes_menu`

```json
{
  "webhook_enabled": false,
  "enabled": true,
  "actions": [
    {
      "_tdActionTitle": "",
      "_tdActionId": "3d1c067f50181bf300a8f0de1139d098",
      "_tdActionType": "replyv2",
      "attributes": {
        "disableInputMessage": false,
        "commands": [
          {
            "type": "wait",
            "time": 500
          },
          {
            "type": "message",
            "message": {
              "type": "text",
              "text": "📘 **Pasaportes**\n\nCon gusto le oriento en sus trámites de Pasaportes. ¿En qué le puedo ayudar?",
              "attributes": {
                "attachment": {
                  "type": "template",
                  "buttons": [
                    {
                      "uid": "5f3803af236bdf9c3e9a262a099c79bb",
                      "type": "action",
                      "value": "📋 Tramitar o renovar (adultos)",
                      "link": "",
                      "target": "blank",
                      "action": "#b81aa876-44c2-4a84-b797-e5a4540d9db7",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "tramitar, renovar, pasaporte adulto, nuevo pasaporte, sacar pasaporte"
                    },
                    {
                      "uid": "e70cc20af5283aa1db045503c7202185",
                      "type": "action",
                      "value": "👦 Pasaporte para niñas, niños y adolescentes",
                      "link": "",
                      "target": "blank",
                      "action": "#ea924816-d137-43a2-988b-311e5fcf1d0b",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "menor, menores, niño, niña, hijo, hija, pasaporte menor"
                    },
                    {
                      "uid": "b90f5abd0b435adba8d93bca03df40d6",
                      "type": "action",
                      "value": "💵 Requisitos y costos",
                      "link": "",
                      "target": "blank",
                      "action": "#a0c15f09-9aca-413a-bd62-bc971ead16c1",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "requisitos, costos, costo, precio, cuanto cuesta"
                    },
                    {
                      "uid": "f1350cbe78f8779d6d616e6c947cadb1",
                      "type": "action",
                      "value": "📅 Citas y reprogramación",
                      "link": "",
                      "target": "blank",
                      "action": "#948f0792-9909-417d-9553-a55149d6bbae",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "cita, citas, agendar, reprogramar, cambiar cita, nueva cita"
                    },
                    {
                      "uid": "6f9751c0b32f4a748022087eb3a57293",
                      "type": "action",
                      "value": "➕ Ver más opciones",
                      "link": "",
                      "target": "blank",
                      "action": "#2b5af009-6289-45b4-b780-9b5f44ef70fd",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "más opciones, ver más, continuar"
                    },
                    {
                      "uid": "24d829959b6366e9657c01eb466abcb3",
                      "type": "action",
                      "value": "🧑‍💼 Hablar con un agente humano de Pasaportes",
                      "link": "",
                      "target": "blank",
                      "action": "#ce79fbe0-f06b-4288-9230-e8141a59dc48",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "agente, hablar, humano"
                    },
                    {
                      "uid": "2ffc4e50313f79a7f623b4c424ad9782",
                      "type": "action",
                      "value": "🏠 Menú principal",
                      "link": "",
                      "target": "blank",
                      "action": "#5c24130f-7a96-4760-a3dd-702ba95ab989",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "menu, inicio, regresar, principal"
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
  "intent_display_name": "pasaportes_menu",
  "intent_id": "b8fc2220-888f-44f6-aa25-37b85f4639f4",
  "question": "pasaporte\ntramitar pasaporte\nrenovar pasaporte\npasaportes",
  "language": "es",
  "attributes": {
    "position": {
      "x": -1111,
      "y": -4841
    },
    "readonly": false,
    "color": "86,179,101",
    "nextBlockAction": {
      "_tdActionId": "ca6f313213a35de65384fb454eb85e5c",
      "_tdActionType": "intent",
      "intentName": null
    }
  },
  "agents_available": false
}
```

### `pasaportes_menu_p2`

```json
{
  "webhook_enabled": false,
  "enabled": true,
  "actions": [
    {
      "_tdActionTitle": "",
      "_tdActionId": "76a8516ac2e94541a80e6b8c9471b8cc",
      "_tdActionType": "replyv2",
      "attributes": {
        "disableInputMessage": false,
        "commands": [
          {
            "type": "wait",
            "time": 500
          },
          {
            "type": "message",
            "message": {
              "type": "text",
              "text": "📘 **Pasaportes › Más opciones**\n\n¿Qué información necesita?",
              "attributes": {
                "attachment": {
                  "type": "template",
                  "buttons": [
                    {
                      "uid": "9fa872349f45f1c9e6911d2bcef3391b",
                      "type": "action",
                      "value": "🔄 Extensión de vigencia",
                      "link": "",
                      "target": "blank",
                      "action": "#0332cf95-f48d-4dcb-a370-f6126a5fd777",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "extension, vigencia, ampliar, extender"
                    },
                    {
                      "uid": "9e604c9ab8ac12f4050eab456b806c52",
                      "type": "action",
                      "value": "🚨 Pérdida, robo o deteriorado",
                      "link": "",
                      "target": "blank",
                      "action": "#31773596-30c1-48b6-87a8-30e46840ab2e",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "perdi, robaron, robo, extraviado, deteriorado, pasaporte perdido, me robaron"
                    },
                    {
                      "uid": "2d636530b65812ad86560336466d781c",
                      "type": "action",
                      "value": "✈️ Pasaporte en el extranjero",
                      "link": "",
                      "target": "blank",
                      "action": "#b68abe10-7946-482b-b34e-60e73ed89f49",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "extranjero, fuera, consulado, afuera de guatemala"
                    },
                    {
                      "uid": "407f12113883fb54de0d170903025e50",
                      "type": "action",
                      "value": "💳 Devolución de pago",
                      "link": "",
                      "target": "blank",
                      "action": "#dd074f52-82f3-4dc3-9438-5e42a0f59749",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "devolucion, reembolso, devolver pago"
                    },
                    {
                      "uid": "d73323620d834f21b7267db31677cff8",
                      "type": "text",
                      "value": "📘 ¿Cuándo puedo renovar mi pasaporte?",
                      "link": "",
                      "target": "blank",
                      "action": "",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "renovar pasaporte, cuando renovar"
                    },
                    {
                      "uid": "c40920c1ce95463a9cba991153ce24a5",
                      "type": "text",
                      "value": "💳 ¿Cuánto tiempo es válida la boleta de pago?",
                      "link": "",
                      "target": "blank",
                      "action": "",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "boleta, vigencia boleta, tiempo boleta"
                    },
                    {
                      "uid": "fc6273bdcae1425b854cbe0819e28a3a",
                      "type": "action",
                      "value": "🏠 Menú principal",
                      "link": "",
                      "target": "blank",
                      "action": "#5c24130f-7a96-4760-a3dd-702ba95ab989",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "menu, inicio, regresar, principal"
                    },
                    {
                      "uid": "d2eae1b7081c41c0836afb7a54e20aee",
                      "type": "action",
                      "value": "⬅️ Volver a Pasaportes",
                      "link": "",
                      "target": "blank",
                      "action": "#b8fc2220-888f-44f6-aa25-37b85f4639f4",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "volver, regresar, anterior"
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
  "intent_display_name": "pasaportes_menu_p2",
  "intent_id": "2b5af009-6289-45b4-b780-9b5f44ef70fd",
  "question": "pasaporte\ntramitar pasaporte\nrenovar pasaporte\npasaportes",
  "language": "es",
  "attributes": {
    "position": {
      "x": 400,
      "y": -4841
    },
    "readonly": false,
    "color": "86,179,101",
    "nextBlockAction": {
      "_tdActionId": "cba36126c58d4799a9bd893d8af739ee",
      "_tdActionType": "intent",
      "intentName": "#aca70bcd-564f-423c-802d-2db67fca51bd"
    }
  },
  "agents_available": false
}
```

### `psp_regresar`

```json
{
  "webhook_enabled": false,
  "enabled": true,
  "actions": [
    {
      "_tdActionTitle": "",
      "_tdActionId": "bb79808385e736bb1191ad2c6198ebb6",
      "_tdActionType": "replyv2",
      "attributes": {
        "disableInputMessage": false,
        "commands": [
          {
            "type": "wait",
            "time": 1000
          },
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
                      "uid": "7b221a6eb2c3d488fd223100a3ebc8b1",
                      "type": "action",
                      "value": "⬅️ Volver a Pasaportes",
                      "link": "",
                      "target": "blank",
                      "action": "#b8fc2220-888f-44f6-aa25-37b85f4639f4",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "volver, regresar, anterior"
                    },
                    {
                      "uid": "6690565272d38095b151eda3e2e9d402",
                      "type": "action",
                      "value": "🏠 Ir al menú principal",
                      "link": "",
                      "target": "blank",
                      "action": "#5c24130f-7a96-4760-a3dd-702ba95ab989",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "menu, inicio, volver, regresar, empezar"
                    }
                  ],
                  "json_buttons": ""
                }
              },
              "_tdJSONCondition": {
                "type": "expression",
                "conditions": []
              }
            }
          }
        ]
      },
      "noInputTimeout": 660000,
      "noInputIntent": "#dc484960-3cb4-4198-9d3a-24afef961603"
    }
  ],
  "intent_display_name": "psp_regresar",
  "intent_id": "7184a924-5395-4df5-9e57-e27a47cea822",
  "language": "es",
  "attributes": {
    "position": {
      "x": 675,
      "y": -4197
    },
    "readonly": false,
    "color": "86,179,101",
    "nextBlockAction": {
      "_tdActionId": "85d1d24f456a56e667eaf6764dba8c8c",
      "_tdActionType": "intent",
      "intentName": null
    }
  },
  "agents_available": false
}
```

### `psp_regresar_p2`

```json
{
  "webhook_enabled": false,
  "enabled": true,
  "actions": [
    {
      "_tdActionTitle": "",
      "_tdActionId": "a69eea35b59d4840bb7458e6c409feb1",
      "_tdActionType": "replyv2",
      "attributes": {
        "disableInputMessage": false,
        "commands": [
          {
            "type": "wait",
            "time": 1000
          },
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
                      "uid": "5c19479b9f024cb79badc4efb769e938",
                      "type": "action",
                      "value": "⬅️ Volver a Pasaportes (más opciones)",
                      "link": "",
                      "target": "blank",
                      "action": "#2b5af009-6289-45b4-b780-9b5f44ef70fd",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "volver, regresar, pasaportes"
                    },
                    {
                      "uid": "bc50d06949e348409d4189bc88c48e34",
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
              },
              "_tdJSONCondition": {
                "type": "expression",
                "conditions": []
              }
            }
          }
        ]
      },
      "noInputTimeout": 660000,
      "noInputIntent": "#dc484960-3cb4-4198-9d3a-24afef961603"
    }
  ],
  "intent_display_name": "psp_regresar_p2",
  "intent_id": "aca70bcd-564f-423c-802d-2db67fca51bd",
  "language": "es",
  "attributes": {
    "position": {
      "x": 1075,
      "y": -4197
    },
    "readonly": false,
    "color": "86,179,101",
    "nextBlockAction": {
      "_tdActionId": "85d1d24f456a56e667eaf6764dba8c8c",
      "_tdActionType": "intent",
      "intentName": null
    }
  },
  "agents_available": false
}
```

---

## PLAN RETORNO AL HOGAR

### `prh_menu`

```json
{
  "webhook_enabled": false,
  "enabled": true,
  "actions": [
    {
      "_tdActionTitle": "",
      "_tdActionId": "9725ff57a36778256afea445d6099abe",
      "_tdActionType": "replyv2",
      "attributes": {
        "disableInputMessage": false,
        "commands": [
          {
            "type": "wait",
            "time": 500
          },
          {
            "type": "message",
            "message": {
              "type": "text",
              "text": "🏡 **Plan Retorno al Hogar**\n\nEl Plan Retorno al Hogar brinda atención y acompañamiento a personas guatemaltecas retornadas, facilitando su reintegración y el acceso a nuevas oportunidades en Guatemala.\n\n¿Qué información necesita?",
              "attributes": {
                "attachment": {
                  "type": "template",
                  "buttons": [
                    {
                      "uid": "d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8",
                      "type": "action",
                      "value": "🏠 ¿Qué es el Plan Retorno al Hogar?",
                      "link": "",
                      "target": "blank",
                      "action": "#a3f2d1c0-b9e8-4fa2-bc11-943768b06cf2",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "qué es, plan retorno, retorno al hogar, descripción"
                    },
                    {
                      "uid": "91adc46561584c1bb7db841fb93119a8",
                      "type": "action",
                      "value": "🏢 ¿Qué servicios ofrece el CAR?",
                      "link": "",
                      "target": "blank",
                      "action": "#41f4c85a-f661-4947-b550-2c2056782210",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "car, servicios"
                    },
                    {
                      "uid": "0daaaad44111419eadc44e9b7472dd91",
                      "type": "action",
                      "value": "🪪 ¿Cómo tramitar mi DPI?",
                      "link": "",
                      "target": "blank",
                      "action": "#7be80bf4-2950-461b-aa6b-e300f2164875",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "dpi, documento"
                    },
                    {
                      "uid": "3ca8c9955ce74edd910827b64cd99d15",
                      "type": "action",
                      "value": "📦 ¿No recibí todas mis pertenencias?",
                      "link": "",
                      "target": "blank",
                      "action": "#237e14ae-1a43-4c8b-a395-4616d09b84dc",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "pertenencias, maleta"
                    },
                    {
                      "uid": "ae70782cbae94c6c9debdb2e0e879550",
                      "type": "action",
                      "value": "➕ Ver más preguntas",
                      "link": "",
                      "target": "blank",
                      "action": "#8ffbe129-54d4-4320-a8a1-9d29a1fd2dcd",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "más preguntas, ver más, continuar"
                    },
                    {
                      "uid": "04e3702e31f34960a540cf28641e9ce4",
                      "type": "action",
                      "value": "🧑‍💼 Hablar con un agente humano",
                      "link": "",
                      "target": "blank",
                      "action": "#da5fa6a2-6e63-4a66-bb25-8ef3b86e4592",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "agente, hablar, humano"
                    },
                    {
                      "uid": "e2e04493bba64d87a7f86ef418a04878",
                      "type": "action",
                      "value": "🏠 Menú principal",
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
  ],
  "intent_display_name": "prh_menu",
  "intent_id": "e75d9625-ac81-428e-8ea4-c287ba122972",
  "question": "plan retorno al hogar\nretorno al hogar\nretornado\nretornados\nmigrante retornado\nCAR\nprh",
  "language": "es",
  "attributes": {
    "position": {
      "x": -1035,
      "y": 8873
    },
    "readonly": false,
    "color": "56, 142, 60",
    "nextBlockAction": {
      "_tdActionId": "80ac905d73d0499a3571eb98c5e25107",
      "_tdActionType": "intent",
      "intentName": null
    }
  },
  "agents_available": false
}
```

### `prh_preguntas_frecuentes_menu`

```json
{
  "webhook_enabled": false,
  "enabled": true,
  "actions": [
    {
      "_tdActionTitle": "",
      "_tdActionId": "9f704fe3d73477b0d778d97295e6a2e9",
      "_tdActionType": "replyv2",
      "attributes": {
        "disableInputMessage": false,
        "commands": [
          {
            "type": "wait",
            "time": 500
          },
          {
            "type": "message",
            "message": {
              "type": "text",
              "text": "🏡 **Plan Retorno al Hogar › Más preguntas frecuentes**\n\n¿Qué información necesita?",
              "attributes": {
                "attachment": {
                  "type": "template",
                  "buttons": [
                    {
                      "uid": "8e5e7b2a896a4c9eb1770799e3c4da01",
                      "type": "action",
                      "value": "📘 ¿Cómo tramitar mi pasaporte?",
                      "link": "",
                      "target": "blank",
                      "action": "#d0a21f02-2d3e-49f9-9225-1676e27affa8",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "pasaporte"
                    },
                    {
                      "uid": "86acc7d8b8dd4851b6b69b82f2030e33",
                      "type": "action",
                      "value": "🚌 ¿Dónde puedo tomar el bus?",
                      "link": "",
                      "target": "blank",
                      "action": "#8e8607a9-e85d-4ca7-8497-d226f09dff99",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "bus, terminal, transporte"
                    },
                    {
                      "uid": "e83b028286d84ad693d1aa3519b261e1",
                      "type": "action",
                      "value": "👨‍👩‍👧 ¿Cómo registro a mis hijos nacidos en EE.UU.?",
                      "link": "",
                      "target": "blank",
                      "action": "#f7380a51-b68c-4ec6-b0c2-41cd988d04cf",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "hijos, eeuu"
                    },
                    {
                      "uid": "fd04a38139bc486c881c3067eb747698",
                      "type": "action",
                      "value": "💼 ¿Dónde buscar trabajo en Guatemala?",
                      "link": "",
                      "target": "blank",
                      "action": "#646fb378-9d16-41bb-bf03-9f41a4e76370",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "trabajo, empleo"
                    },
                    {
                      "uid": "fd6a5180303f4cd2bf3978c172ac9059",
                      "type": "action",
                      "value": "➕ Ver más preguntas",
                      "link": "",
                      "target": "blank",
                      "action": "#e56e9394-0d11-41ec-a378-a7ebc71caeeb",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "más preguntas, ver más, continuar"
                    },
                    {
                      "uid": "7046fa69fcb34a45aff6ebb0e179f9d7",
                      "type": "action",
                      "value": "⬅️ Regresar al menú anterior",
                      "link": "",
                      "target": "blank",
                      "action": "#e75d9625-ac81-428e-8ea4-c287ba122972",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "regresar, anterior, volver"
                    },
                    {
                      "uid": "988c737b755942a0a59e880ea1aaae32",
                      "type": "action",
                      "value": "🏠 Menú principal",
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
  ],
  "intent_display_name": "prh_preguntas_frecuentes_menu",
  "intent_id": "8ffbe129-54d4-4320-a8a1-9d29a1fd2dcd",
  "language": "es",
  "attributes": {
    "position": {
      "x": 29,
      "y": 11148
    },
    "readonly": false,
    "color": "56, 142, 60",
    "nextBlockAction": {
      "_tdActionId": "1892f129f88877e704a8dd982866f05e",
      "_tdActionType": "intent",
      "intentName": null
    }
  },
  "agents_available": false
}
```

### `prh_faq_car_reintegracion`

```json
{
  "webhook_enabled": false,
  "enabled": true,
  "actions": [
    {
      "_tdActionTitle": "",
      "_tdActionId": "3dfd90f5a9ca46ff8e454b0fb0861e88",
      "_tdActionType": "replyv2",
      "attributes": {
        "disableInputMessage": false,
        "commands": [
          {
            "type": "wait",
            "time": 500
          },
          {
            "type": "message",
            "message": {
              "type": "text",
              "text": "🏡 **Plan Retorno al Hogar › Más preguntas frecuentes**\n\n¿Qué información necesita?",
              "attributes": {
                "attachment": {
                  "type": "template",
                  "buttons": [
                    {
                      "uid": "6f3b9294ec8a4c1f88ac91ad1f5350bc",
                      "type": "action",
                      "value": "🏭 ¿Cómo emprender un negocio?",
                      "link": "",
                      "target": "blank",
                      "action": "#291873d9-1df7-49b5-9b89-fd66ffe0d50d",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "emprender, negocio"
                    },
                    {
                      "uid": "30d8946c00e94c6ba145817768c15898",
                      "type": "action",
                      "value": "🛂 ¿Puedo solicitar visa para regresar a EE.UU. si mi salida fue voluntaria?",
                      "link": "",
                      "target": "blank",
                      "action": "#e112bfbd-a098-4618-bb9b-19ccfbad19ae",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "visa, salida voluntaria"
                    },
                    {
                      "uid": "680ab47aa7ca448fac1c2984d712c697",
                      "type": "action",
                      "value": "🤝 ¿Hay empresas que contraten personas retornadas?",
                      "link": "",
                      "target": "blank",
                      "action": "#ae7a8de4-4515-49b7-8275-edcd2f987b89",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "empresas, contratan"
                    },
                    {
                      "uid": "fedf2dbc3714480686844dd3dc1e1335",
                      "type": "action",
                      "value": "🏫 ¿Cómo inscribo a mis hijos en la escuela?",
                      "link": "",
                      "target": "blank",
                      "action": "#6df30e05-c876-4fdc-ab8b-f8318ca98761",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "escuela, colegio, inscribir"
                    },
                    {
                      "uid": "e22c16e2033943f0846550da56944dc6",
                      "type": "action",
                      "value": "➕ Ver más preguntas",
                      "link": "",
                      "target": "blank",
                      "action": "#992a87cc-17e3-44ef-9c09-5f5cbeba4a68",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "más preguntas, ver más, continuar"
                    },
                    {
                      "uid": "c24fea9fb9fc40fa8b8945bbd4e2bdb6",
                      "type": "action",
                      "value": "⬅️ Regresar al menú anterior",
                      "link": "",
                      "target": "blank",
                      "action": "#8ffbe129-54d4-4320-a8a1-9d29a1fd2dcd",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "regresar, anterior, volver"
                    },
                    {
                      "uid": "7ca9d14f3df64baa9c6faa00a2d7cb40",
                      "type": "action",
                      "value": "🏠 Menú principal",
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
      }
    }
  ],
  "intent_display_name": "prh_faq_car_reintegracion",
  "intent_id": "e56e9394-0d11-41ec-a378-a7ebc71caeeb",
  "language": "es",
  "attributes": {
    "position": {
      "x": 862,
      "y": 13346
    },
    "readonly": false,
    "color": "56, 142, 60",
    "nextBlockAction": {
      "_tdActionId": "d3b9c7185ed643568a2ded8145e00f63",
      "_tdActionType": "intent",
      "intentName": "#a7c3e812-5f2d-4b1e-9d6a-3c8f0e2b7a94"
    }
  },
  "agents_available": false
}
```

### `prh_faq_page4`

```json
{
  "webhook_enabled": false,
  "enabled": true,
  "actions": [
    {
      "_tdActionTitle": "",
      "_tdActionId": "df484b50a8af46d2801a3344040d3efb",
      "_tdActionType": "replyv2",
      "attributes": {
        "disableInputMessage": false,
        "commands": [
          {
            "type": "wait",
            "time": 500
          },
          {
            "type": "message",
            "message": {
              "type": "text",
              "text": "🏡 **Plan Retorno al Hogar › Más preguntas frecuentes**\n\n¿Qué información necesita?",
              "attributes": {
                "attachment": {
                  "type": "template",
                  "buttons": [
                    {
                      "uid": "ec99f4dcfbd94161bba43132cc6d6f5e",
                      "type": "action",
                      "value": "🆘 ¿Tiene una necesidad especial o urgente?",
                      "link": "",
                      "target": "blank",
                      "action": "#c4e50ced-2dda-4d23-bbff-8e2e194ca939",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "emergencia, urgencia"
                    },
                    {
                      "uid": "437c6678e389403cab98afa987623f34",
                      "type": "action",
                      "value": "🍲 ¿Dónde conseguir apoyo alimentario?",
                      "link": "",
                      "target": "blank",
                      "action": "#2c42b480-b9e8-4ca2-bc00-843768b06cf0",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "alimentos, apoyo alimentario"
                    },
                    {
                      "uid": "c080c47eef684501a6befc0cdc946689",
                      "type": "action",
                      "value": "📋 ¿Perdió su Constancia de Retorno?",
                      "link": "",
                      "target": "blank",
                      "action": "#e07d5553-165b-4bc3-b89f-98632ae234da",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "constancia, perdí, extravié"
                    },
                    {
                      "uid": "617bef035e794f3f837a696aae5a3c36",
                      "type": "action",
                      "value": "👪 ¿Busca información sobre un familiar que retorna?",
                      "link": "",
                      "target": "blank",
                      "action": "#b14ec363-2944-4059-9c1e-7d6d17ffeaf9",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "familiar, familia"
                    },
                    {
                      "uid": "9d5f43bfc59b4f0ebf51ba76640d329d",
                      "type": "action",
                      "value": "⬅️ Regresar al menú anterior",
                      "link": "",
                      "target": "blank",
                      "action": "#e56e9394-0d11-41ec-a378-a7ebc71caeeb",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "regresar, anterior, volver"
                    },
                    {
                      "uid": "0a00e1b149e54d58a3cf279694a86995",
                      "type": "action",
                      "value": "🏠 Menú principal",
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
      }
    }
  ],
  "intent_display_name": "prh_faq_page4",
  "intent_id": "992a87cc-17e3-44ef-9c09-5f5cbeba4a68",
  "language": "es",
  "attributes": {
    "position": {
      "x": 1900,
      "y": 13346
    },
    "readonly": false,
    "color": "56, 142, 60",
    "nextBlockAction": {
      "_tdActionId": "2e600a0beb18450d8485a36601a59758",
      "_tdActionType": "intent",
      "intentName": "#a7c3e812-5f2d-4b1e-9d6a-3c8f0e2b7a94"
    }
  },
  "agents_available": false
}
```

### `volver_prh_p2`

```json
{
  "webhook_enabled": false,
  "enabled": true,
  "actions": [
    {
      "_tdActionTitle": "",
      "_tdActionId": "2960fc43449c461c95021337fb929014",
      "_tdActionType": "replyv2",
      "attributes": {
        "disableInputMessage": false,
        "commands": [
          {
            "type": "wait",
            "time": 0
          },
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
                      "uid": "778a64bef20f415b8355c5e05be6f06a",
                      "type": "action",
                      "value": "🧑‍💼 Hablar con un agente humano",
                      "link": "",
                      "target": "blank",
                      "action": "#da5fa6a2-6e63-4a66-bb25-8ef3b86e4592",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "agente, hablar, humano"
                    },
                    {
                      "uid": "25fc32c80d854202a4206a7900a42a7d",
                      "type": "action",
                      "value": "⬅️ Volver a Plan Retorno al Hogar (página 2)",
                      "link": "",
                      "target": "blank",
                      "action": "#8ffbe129-54d4-4320-a8a1-9d29a1fd2dcd",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "regresar, anterior, volver"
                    },
                    {
                      "uid": "485e611c646c459cbb0f7de65fa01cc2",
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
              },
              "_tdJSONCondition": {
                "type": "expression",
                "conditions": []
              }
            }
          }
        ],
        "noInputTimeout": 660000,
        "noInputIntent": "#dc484960-3cb4-4198-9d3a-24afef961603"
      }
    }
  ],
  "intent_display_name": "volver_prh_p2",
  "intent_id": "94af947d-0de2-407b-ab3c-8f998d16e25a",
  "language": "es",
  "attributes": {
    "position": {
      "x": 1575,
      "y": 9024
    },
    "readonly": false,
    "color": "56, 142, 60",
    "nextBlockAction": {
      "_tdActionId": "577da92d79184fdfa73f0c07ac5aea08",
      "_tdActionType": "intent",
      "intentName": null
    }
  },
  "agents_available": false
}
```

### `volver_prh_p3`

```json
{
  "webhook_enabled": false,
  "enabled": true,
  "actions": [
    {
      "_tdActionTitle": "",
      "_tdActionId": "7e784daad8a3462ca33999d4aa54c9ce",
      "_tdActionType": "replyv2",
      "attributes": {
        "disableInputMessage": false,
        "commands": [
          {
            "type": "wait",
            "time": 500
          },
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
                      "uid": "94d7577682824c7d8cbd7c849810c81c",
                      "type": "action",
                      "value": "⬅️ Volver a Plan Retorno al Hogar (página 3)",
                      "link": "",
                      "target": "blank",
                      "action": "#e56e9394-0d11-41ec-a378-a7ebc71caeeb",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "regresar, anterior, volver"
                    },
                    {
                      "uid": "a885122c73714b9dafe4093af559a0bc",
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
        ],
        "noInputTimeout": 660000,
        "noInputIntent": "#dc484960-3cb4-4198-9d3a-24afef961603"
      }
    }
  ],
  "intent_display_name": "volver_prh_p3",
  "intent_id": "b7f26024-1391-4901-ab66-5d706b65ac75",
  "language": "es",
  "attributes": {
    "position": {
      "x": 2362,
      "y": 11546
    },
    "readonly": false,
    "color": "56, 142, 60",
    "nextBlockAction": {
      "_tdActionId": "fa5bf894c30247d1a26c889103c5dca4",
      "_tdActionType": "intent",
      "intentName": null
    }
  },
  "agents_available": false
}
```

### `volver_prh_p4`

```json
{
  "webhook_enabled": false,
  "enabled": true,
  "actions": [
    {
      "_tdActionTitle": "",
      "_tdActionId": "bc44e57889654ae5b6e6ee51a4f8099f",
      "_tdActionType": "replyv2",
      "attributes": {
        "disableInputMessage": false,
        "commands": [
          {
            "type": "wait",
            "time": 500
          },
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
                      "uid": "3056cdcb6c4f4fd0ada93741a53d4e62",
                      "type": "action",
                      "value": "🧑‍💼 Hablar con un agente humano",
                      "link": "",
                      "target": "blank",
                      "action": "#da5fa6a2-6e63-4a66-bb25-8ef3b86e4592",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "agente, hablar, humano"
                    },
                    {
                      "uid": "3e62486fd6144f81a605833ecd72f1fa",
                      "type": "action",
                      "value": "⬅️ Volver a Plan Retorno al Hogar (página 4)",
                      "link": "",
                      "target": "blank",
                      "action": "#992a87cc-17e3-44ef-9c09-5f5cbeba4a68",
                      "attributes": "",
                      "show_echo": true,
                      "alias": "regresar, anterior, volver"
                    },
                    {
                      "uid": "38350ef3fa11489f961a6b73432d8e67",
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
        ],
        "noInputTimeout": 660000,
        "noInputIntent": "#dc484960-3cb4-4198-9d3a-24afef961603"
      }
    }
  ],
  "intent_display_name": "volver_prh_p4",
  "intent_id": "5ac74d36-e087-45fb-b13f-922bd286add0",
  "language": "es",
  "attributes": {
    "position": {
      "x": 3661,
      "y": 14300
    },
    "readonly": false,
    "color": "56, 142, 60",
    "nextBlockAction": {
      "_tdActionId": "a561e8c01a434d92b38d9cf4368984ff",
      "_tdActionType": "intent",
      "intentName": null
    }
  },
  "agents_available": false
}
```

