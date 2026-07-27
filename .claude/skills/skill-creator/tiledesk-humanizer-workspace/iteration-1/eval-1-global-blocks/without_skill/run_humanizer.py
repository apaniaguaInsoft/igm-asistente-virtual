#!/usr/bin/env python3
"""
Script to humanize 4 global blocks in the IGM Tiledesk chatbot JSON.
Run this script to:
1. Copy the original JSON to the workspace
2. Apply humanized text to the 4 target blocks
3. Validate the JSON
4. Save a changes summary
"""

import json
import os
import shutil

SRC = "/Users/apaniagua/Proyectos/asistente-virtual-igm/IGM Web Asistente Virtual.json"
DEST_DIR = "/Users/apaniagua/Proyectos/asistente-virtual-igm/.claude/skills/skill-creator/tiledesk-humanizer-workspace/iteration-1/eval-1-global-blocks/without_skill"
DEST = os.path.join(DEST_DIR, "IGM Web Asistente Virtual.json")
OUTPUTS = os.path.join(DEST_DIR, "outputs")

os.makedirs(OUTPUTS, exist_ok=True)

# Copy original
shutil.copy2(SRC, DEST)
print(f"Copied to: {DEST}")

# Load JSON
with open(DEST, "r", encoding="utf-8") as f:
    data = json.load(f)

changes = []

# Humanized texts (keyed by intent_display_name)
HUMANIZED_TEXTS = {
    "bienvenida": (
        "👋 ¡Bienvenido al Instituto Guatemalteco de Migración! Soy el asistente virtual del IGM.",
        "👋 ¡Hola! Bienvenido al Instituto Guatemalteco de Migración. Soy tu asistente virtual y estoy aquí para ayudarte con cualquier trámite o consulta que tengas. ¿Cómo puedo asistirte hoy?"
    ),
    "menu_principal": (
        "¿En qué puedo ayudarle hoy?\n\nSelecciona una opción:",
        "¡Con gusto te ayudo! ¿Sobre qué tema tienes una consulta hoy? Elige la opción que más se ajuste a lo que necesitas:"
    ),
    "defaultFallback": (
        "😅 Disculpa, no he entendido tu mensaje. Puedes regresar al menú principal.\n\n📌 *¿Qué deseas hacer ahora?*",
        "😅 Disculpa, no logré entender bien lo que escribiste. No te preocupes, puedo ayudarte desde el menú principal.\n\n📌 *¿Qué te gustaría hacer ahora?*"
    ),
    "timeout_inactividad": (
        "No hubo respuesta por más de 10 minutos, se cerró el chat automáticamente. ¡Que tenga buen día! 😊",
        "Parece que estuviste un rato sin responder, así que cerramos el chat para no dejarte esperando. Cuando quieras, puedes volver a escribirnos, ¡aquí estaremos! 😊 ¡Que tengas un excelente día!"
    )
}

def find_and_replace_text(commands, old_text, new_text, block_name):
    """Recursively search commands for the old text and replace it."""
    for cmd in commands:
        if cmd.get("type") == "message":
            msg = cmd.get("message", {})
            if msg.get("text") == old_text:
                msg["text"] = new_text
                changes.append({
                    "block": block_name,
                    "old": old_text,
                    "new": new_text
                })
                return True
    return False

# Iterate through intents and apply changes
for intent in data.get("intents", []):
    name = intent.get("intent_display_name", "")
    if name not in HUMANIZED_TEXTS:
        continue

    old_text, new_text = HUMANIZED_TEXTS[name]

    for action in intent.get("actions", []):
        attrs = action.get("attributes", {})
        commands = attrs.get("commands", [])
        if find_and_replace_text(commands, old_text, new_text, name):
            break

# Save modified JSON
with open(DEST, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=4)
print("JSON saved.")

# Validate
with open(DEST, "r", encoding="utf-8") as f:
    json.load(f)
print("JSON válido ✓")

# Summary
summary_lines = [
    "# Resumen de Cambios — Humanización de Bloques Globales",
    "",
    f"Fecha: 2026-07-23",
    f"Archivo origen: {SRC}",
    f"Archivo destino: {DEST}",
    "",
    "## Bloques modificados",
    "",
]

descriptions = {
    "bienvenida": "Mensaje de bienvenida al inicio de la conversación",
    "menu_principal": "Pregunta introductoria del menú principal",
    "defaultFallback": "Respuesta cuando el bot no entiende el mensaje del usuario",
    "timeout_inactividad": "Mensaje de cierre por inactividad de 10 minutos",
}

criteria = [
    "Usa 'tú' (tuteo) en lugar de 'usted' o 'le'",
    "Tono cálido y conversacional, como un colaborador amable",
    "Evita lenguaje burocrático o de formulario",
    "Mantiene todos los emojis y estructura de botones sin cambios",
    "Conserva el significado y la funcionalidad originales",
]

for change in changes:
    block = change["block"]
    summary_lines.append(f"### `{block}` — {descriptions.get(block, '')}")
    summary_lines.append("")
    summary_lines.append("**Texto original:**")
    summary_lines.append(f"```")
    summary_lines.append(change["old"])
    summary_lines.append("```")
    summary_lines.append("")
    summary_lines.append("**Texto humanizado:**")
    summary_lines.append(f"```")
    summary_lines.append(change["new"])
    summary_lines.append("```")
    summary_lines.append("")

summary_lines += [
    "## Criterios aplicados",
    "",
] + [f"- {c}" for c in criteria] + [
    "",
    "## Bloques NO modificados",
    "",
    "El resto de los bloques del flujo se mantienen sin cambios en esta iteración.",
    "Solo se intervinieron los 4 bloques globales de mayor impacto en la experiencia inicial del usuario.",
]

summary_path = os.path.join(OUTPUTS, "changes_summary.md")
with open(summary_path, "w", encoding="utf-8") as f:
    f.write("\n".join(summary_lines) + "\n")

print(f"Summary saved to: {summary_path}")
print(f"\nChanges applied: {len(changes)}")
for c in changes:
    print(f"  - {c['block']}")
