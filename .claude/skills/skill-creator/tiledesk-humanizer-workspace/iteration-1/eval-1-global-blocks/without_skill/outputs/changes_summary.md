# Resumen de Cambios — Humanización de Bloques Globales

Fecha: 2026-07-23
Archivo origen: /Users/apaniagua/Proyectos/asistente-virtual-igm/IGM Web Asistente Virtual.json
Archivo destino: /Users/apaniagua/Proyectos/asistente-virtual-igm/.claude/skills/skill-creator/tiledesk-humanizer-workspace/iteration-1/eval-1-global-blocks/without_skill/IGM Web Asistente Virtual.json

## Bloques modificados

### `defaultFallback` — Respuesta cuando el bot no entiende el mensaje del usuario

**Texto original:**
```
😅 Disculpa, no he entendido tu mensaje. Puedes regresar al menú principal.

📌 *¿Qué deseas hacer ahora?*
```

**Texto humanizado:**
```
😅 Disculpa, no logré entender bien lo que escribiste. No te preocupes, puedo ayudarte desde el menú principal.

📌 *¿Qué te gustaría hacer ahora?*
```

### `menu_principal` — Pregunta introductoria del menú principal

**Texto original:**
```
¿En qué puedo ayudarle hoy?

Selecciona una opción:
```

**Texto humanizado:**
```
¡Con gusto te ayudo! ¿Sobre qué tema tienes una consulta hoy? Elige la opción que más se ajuste a lo que necesitas:
```

### `timeout_inactividad` — Mensaje de cierre por inactividad de 10 minutos

**Texto original:**
```
No hubo respuesta por más de 10 minutos, se cerró el chat automáticamente. ¡Que tenga buen día! 😊
```

**Texto humanizado:**
```
Parece que estuviste un rato sin responder, así que cerramos el chat para no dejarte esperando. Cuando quieras, puedes volver a escribirnos, ¡aquí estaremos! 😊 ¡Que tengas un excelente día!
```

### `bienvenida` — Mensaje de bienvenida al inicio de la conversación

**Texto original:**
```
👋 ¡Bienvenido al Instituto Guatemalteco de Migración! Soy el asistente virtual del IGM.
```

**Texto humanizado:**
```
👋 ¡Hola! Bienvenido al Instituto Guatemalteco de Migración. Soy tu asistente virtual y estoy aquí para ayudarte con cualquier trámite o consulta que tengas. ¿Cómo puedo asistirte hoy?
```

## Criterios aplicados

- Usa 'tú' (tuteo) en lugar de 'usted' o 'le'
- Tono cálido y conversacional, como un colaborador amable
- Evita lenguaje burocrático o de formulario
- Mantiene todos los emojis y estructura de botones sin cambios
- Conserva el significado y la funcionalidad originales

## Bloques NO modificados

El resto de los bloques del flujo se mantienen sin cambios en esta iteración.
Solo se intervinieron los 4 bloques globales de mayor impacto en la experiencia inicial del usuario.
