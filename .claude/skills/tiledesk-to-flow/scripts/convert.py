#!/usr/bin/env python3
"""
Convert Tiledesk chatbot JSON to IGM Flow tree format (DEFAULT_FLOW in api/flow.js).

Usage:
  python3 convert.py <tiledesk.json> [output.json]

Outputs:
  A JSON file (or stdout) with the recursive tree structure ready to paste
  as DEFAULT_FLOW in api/flow.js, or to POST to /api/flow as a new version.
"""

import json
import sys
import re


# ── Helpers ────────────────────────────────────────────────────────────────

def build_index(data):
    """Build intent_id → intent dict."""
    return {i["intent_id"]: i for i in data.get("intents", [])}


def find_intent(intents, display_name):
    for i in intents:
        if i.get("intent_display_name") == display_name:
            return i
    return None


def infer_cat(display_name, fallback_cat="root"):
    """
    Infer category from intent display_name.
    Returns one of: root, pasaportes, extranjeria, control, info, prh, agente, agente-*
    """
    n = display_name.lower()
    if any(k in n for k in ("psp_", "pasaporte")):
        return "pasaportes"
    if any(k in n for k in ("ext_", "extranjeria", "extranjería")):
        return "extranjeria"
    if any(k in n for k in ("ctrl_", "control_")):
        return "control"
    if any(k in n for k in ("info_", "refugio", "viajero", "empleo", "firma", "prh_", "retorno")):
        return "info"
    if n.startswith("prh") or "retorno" in n:
        return "info"
    # agent-family intents inherit parent category
    return fallback_cat


def get_message_and_buttons(intent):
    """
    Return (text, buttons) from the intent's reply actions.
    buttons: list of {'value': str, 'alias': str, 'target_id': str}
    """
    texts = []
    buttons = []
    for action in intent.get("actions", []):
        atype = action.get("_tdActionType")
        if atype not in ("replyv2", "reply"):
            continue
        for cmd in action.get("attributes", {}).get("commands", []):
            if cmd.get("type") != "message":
                continue
            msg = cmd.get("message", {})
            t = msg.get("text", "")
            if t:
                texts.append(t)
            for btn in msg.get("attributes", {}).get("attachment", {}).get("buttons", []):
                target = btn.get("action", "")
                if target and target.startswith("#"):
                    buttons.append({
                        "value": btn.get("value", ""),
                        "alias": btn.get("alias", ""),
                        "target_id": target[1:],
                    })
    return "\n".join(texts), buttons


def get_intents_from_question(intent, extra_alias=""):
    """Extract trigger phrases from the question field."""
    q = intent.get("question", "") or ""
    phrases = []
    for line in q.split("\n"):
        line = line.strip()
        if line and not line.startswith("\\"):
            phrases.append(line)
    if extra_alias:
        for a in re.split(r"[,;]", extra_alias):
            a = a.strip()
            if a and a not in phrases:
                phrases.append(a)
    return phrases


def is_nav_button(value):
    """True if a button is a back/nav button that should not become a child node."""
    v = value.lower()
    return any(k in v for k in (
        "volver", "regresar", "ir al menú", "ir al menu",
        "menú principal", "menu principal", "intentar después",
        "intentar despues", "atrás", "atras",
    ))


def get_ifonline_branches(intent):
    for a in intent.get("actions", []):
        if a.get("_tdActionType") == "ifonlineagentsv2":
            return a.get("trueIntent", "").lstrip("#"), a.get("falseIntent", "").lstrip("#")
    return None, None


def get_ifopenhours_branches(intent):
    for a in intent.get("actions", []):
        if a.get("_tdActionType") == "ifopenhours":
            return a.get("trueIntent", "").lstrip("#"), a.get("falseIntent", "").lstrip("#")
    return None, None


def get_next_intent(intent, index):
    """Follow a nextBlockAction or single intent-redirect action."""
    nb = intent.get("attributes", {}).get("nextBlockAction", {}) or {}
    if nb.get("_tdActionType") == "intent" and nb.get("intentName"):
        return nb["intentName"].lstrip("#")
    for a in intent.get("actions", []):
        if a.get("_tdActionType") == "intent":
            t = a.get("intentName", "") or ""
            if t:
                return t.lstrip("#")
    return None


SKIP_NAMES = {"start", "defaultFallback", "timeout_inactividad", "bienvenida"}


# ── Core recursive converter ────────────────────────────────────────────────

def convert_node(
    intent_id,
    index,
    id_prefix,
    parent_cat,
    visited,
    ancestors,
    btn_label="",
    btn_alias="",
    force_label=None,
    force_type=None,
):
    """
    Recursively convert a Tiledesk intent to a flow node dict.
    Returns a node or None if it should be skipped.

    - visited: set of IDs already turned into nodes (global deduplication)
    - ancestors: set of IDs on the current path (cycle / back-button detection)
    """
    if intent_id in ancestors:
        return None
    if intent_id not in index:
        return None
    if intent_id in visited:
        return None

    intent = index[intent_id]
    display_name = intent.get("intent_display_name", "")

    if display_name in SKIP_NAMES:
        return None

    # Mark visited before recursing so buttons that point back to siblings are skipped
    visited.add(intent_id)
    ancestors = ancestors | {intent_id}  # immutable-style push

    cat = infer_cat(display_name, parent_cat)
    action_types = {a.get("_tdActionType") for a in intent.get("actions", [])}
    detail, buttons = get_message_and_buttons(intent)
    intents_list = get_intents_from_question(intent, btn_alias)

    # ── Determine node type ──────────────────────────────────────────────
    if force_type:
        node_type = force_type
    elif "department" in action_types or "agent" in action_types:
        node_type = "transfer"
    elif "ifopenhours" in action_types:
        node_type = "check"
    elif "ifonlineagentsv2" in action_types:
        node_type = "check"
    elif any(k in display_name.lower() for k in ("fuera_horario", "no_disp", "offline")):
        node_type = "offline"
    else:
        # Decide menu vs final based on whether there are content buttons
        content_btns = [b for b in buttons if not is_nav_button(b["value"])]
        node_type = "menu" if content_btns else "final"

    # ── Build label ──────────────────────────────────────────────────────
    if force_label:
        label = force_label
    elif btn_label:
        label = btn_label
    else:
        label = display_name.replace("_", " ")

    # ── Build children ───────────────────────────────────────────────────
    children = []
    child_counter = 1

    if node_type == "check":
        # ifopenhours: false → fuera de horario, true → check_agentes
        if "ifopenhours" in action_types:
            true_id, false_id = get_ifopenhours_branches(intent)
            if false_id:
                child = convert_node(
                    false_id, index,
                    f"{id_prefix}.{child_counter}",
                    cat, visited, ancestors,
                    btn_label="⏰ Fuera de horario de atención",
                    force_type="offline",
                )
                if child:
                    children.append(child)
                    child_counter += 1
            if true_id:
                child = convert_node(
                    true_id, index,
                    f"{id_prefix}.{child_counter}",
                    cat, visited, ancestors,
                    btn_label="🟢 Dentro de horario → Verificar disponibilidad",
                    force_type="check",
                )
                if child:
                    children.append(child)
                    child_counter += 1

        # ifonlineagentsv2: false → no_disp, true → send_dept (transfer)
        elif "ifonlineagentsv2" in action_types:
            true_id, false_id = get_ifonline_branches(intent)
            if false_id:
                child = convert_node(
                    false_id, index,
                    f"{id_prefix}.{child_counter}",
                    cat, visited, ancestors,
                    btn_label="🔴 Sin agentes disponibles",
                    force_type="offline",
                )
                if child:
                    children.append(child)
                    child_counter += 1
            if true_id:
                # true usually → agente_disp_* or send_dept_*
                # Follow one more hop if it's another redirect
                real_id = true_id
                if real_id in index:
                    t_intent = index[real_id]
                    t_atypes = {a.get("_tdActionType") for a in t_intent.get("actions", [])}
                    # agente_disp usually has reply + next → send_dept
                    next_id = get_next_intent(t_intent, index)
                    if next_id and "department" in (
                        {a.get("_tdActionType") for a in index.get(next_id, {}).get("actions", [])}
                    ):
                        real_id = next_id
                child = convert_node(
                    real_id, index,
                    f"{id_prefix}.{child_counter}",
                    cat, visited, ancestors,
                    btn_label="🟢 Agente disponible → Transferir",
                    force_type="transfer",
                )
                if child:
                    children.append(child)
                    child_counter += 1

    elif node_type in ("menu", "final", "offline"):
        content_btns = [b for b in buttons if not is_nav_button(b["value"])]
        for btn in content_btns:
            if btn["target_id"] in ancestors:
                continue
            child = convert_node(
                btn["target_id"], index,
                f"{id_prefix}.{child_counter}",
                cat, visited, ancestors,
                btn_label=btn["value"],
                btn_alias=btn["alias"],
            )
            if child:
                children.append(child)
                child_counter += 1

    # ── Assemble node ────────────────────────────────────────────────────
    node = {
        "id": id_prefix,
        "label": label,
        "type": node_type,
        "cat": cat,
        "intents": intents_list,
        "detail": detail,
    }
    if children:
        node["children"] = children

    return node


# ── Entry point ─────────────────────────────────────────────────────────────

def convert(tiledesk_path):
    with open(tiledesk_path, encoding="utf-8") as f:
        data = json.load(f)

    index = build_index(data)
    intents = data.get("intents", [])

    # Follow: start → bienvenida → menu_principal
    # We combine bienvenida's welcome text with menu_principal's buttons for the root.
    bienvenida = find_intent(intents, "bienvenida")
    menu_principal = find_intent(intents, "menu_principal")

    if not menu_principal:
        sys.exit("Could not find menu_principal intent.")

    # Build root node manually to merge bienvenida + menu_principal
    welcome_text, _ = get_message_and_buttons(bienvenida) if bienvenida else ("", [])
    main_text, main_buttons = get_message_and_buttons(menu_principal)
    combined_detail = (welcome_text + "\n\n" + main_text).strip() if welcome_text else main_text

    visited = {menu_principal["intent_id"]}
    if bienvenida:
        visited.add(bienvenida["intent_id"])

    # Build children from menu_principal's buttons
    ancestors = {menu_principal["intent_id"]}
    children = []
    child_counter = 1
    for btn in main_buttons:
        if is_nav_button(btn["value"]):
            continue
        child = convert_node(
            btn["target_id"], index,
            f"1.{child_counter}",
            "root", visited, ancestors,
            btn_label=btn["value"],
            btn_alias=btn["alias"],
        )
        if child:
            children.append(child)
            child_counter += 1

    root = {
        "id": "1",
        "label": "Mensaje inicial del asistente",
        "type": "menu",
        "cat": "root",
        "intents": get_intents_from_question(menu_principal),
        "detail": combined_detail,
        "children": children,
    }

    return root


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 convert.py <tiledesk.json> [output.json]", file=sys.stderr)
        sys.exit(1)

    result = convert(sys.argv[1])

    if len(sys.argv) >= 3:
        with open(sys.argv[2], "w", encoding="utf-8") as out:
            json.dump(result, out, ensure_ascii=False, indent=2)
        print(f"Saved to {sys.argv[2]}", file=sys.stderr)
    else:
        print(json.dumps(result, ensure_ascii=False, indent=2))
