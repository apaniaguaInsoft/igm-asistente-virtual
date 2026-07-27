# Changes Summary — Agent Handoff Blocks Humanization

**Date:** 2026-07-23
**File modified:** `IGM Web Asistente Virtual.json` (without_skill copy)
**Validation:** JSON válido ✓

---

## 1. agente_disp_Extranjeria

**Old:**
> ¡Buenas noticias! 🌍 Hay un agente de Extranjería disponible para atenderle ahora mismo. [...] En unos segundos le conectamos con nuestro equipo de Extranjería. ¡Estamos para ayudarle! 😊

**New:**
> ¡Excelente noticia! 🌍 Un especialista de Extranjería está disponible ahora mismo para atenderle. [...] En un momento nuestro equipo de Extranjería le da la bienvenida. ¡Con mucho gusto le ayudamos! 😊

**Why:** Opening now names "Un especialista de Extranjería" (more personal than "Hay un agente"). Closing removed the vague "En unos segundos le conectamos" for a warmer handover phrase.

---

## 2. agente_no_disp_Extranjeria

**Old:**
> ¡Gracias por comunicarse con Extranjería! 🌍 En este momento todos nuestros agentes están ocupados atendiendo a otras personas, pero no queremos dejarte sin ayuda. [...] te avisamos en cuanto un agente quede libre.

**New:**
> ¡Gracias por su paciencia! 🌍 En este momento los especialistas de Extranjería están atendiendo a otras personas, pero no queremos que se quede sin apoyo. [...] le avisamos en cuanto un agente de Extranjería quede disponible.

**Why:** Changed informal "dejarte" to formal "que se quede" (consistent tone). Department name added to the wait option text. Self-service link repositioned before the options.

---

## 3. agente_disp_Pasaportes

**Old:**
> ¡Perfecto! 🛂 Hay un agente de Pasaportes disponible para atenderle ahora mismo. [...] Le estamos conectando con uno de nuestros especialistas. ¡Ya casi! 😊

**New:**
> ¡Qué buena noticia! 🛂 Hay un especialista de Pasaportes disponible para atenderle ahora mismo. [...] Nuestro equipo de Pasaportes está a punto de recibirle. ¡Ya falta poco! 😊

**Why:** Closing now explicitly names "equipo de Pasaportes" instead of generic "nuestros especialistas". Slightly warmer opening phrase.

---

## 4. agente_no_disp_Pasaportes

**Old:**
> ¡Gracias por contactar a Pasaportes! 🛂 Nuestros agentes están ocupados en este momento, pero con gusto le atendemos pronto. [...] le avisamos cuando un agente esté libre.

**New:**
> ¡Gracias por comunicarse con Pasaportes! 🛂 Los especialistas de Pasaportes están apoyando a otras personas en este momento, pero queremos atenderle lo antes posible. [...] le avisamos en cuanto un agente de Pasaportes esté libre.

**Why:** "Nuestros agentes" → "Los especialistas de Pasaportes". Department name added to wait option. More reassuring closing ("lo antes posible").

---

## 5. agente_disp_InformacionGeneral

**Old:**
> ¡Qué bien! ℹ️ Hay un agente disponible para orientarle sobre sus trámites y servicios del IGM. [...] En un momento le conectamos con nuestro equipo de Información General. Estamos aquí para ayudarle. 😊

**New:**
> ¡Excelente! ℹ️ Un especialista de Información General está disponible para orientarle sobre cualquier trámite o servicio del IGM. [...] En un momento nuestro equipo de Información General le atiende con gusto. ¡Aquí estamos para usted! 😊

**Why:** Opening now names department explicitly. "le conectamos" → "le atiende con gusto" (active, warmer). Closing rephrased to be more personal.

---

## 6. agente_no_disp_InformacionGeneral

**Old:**
> ¡Gracias por contactarnos! ℹ️ En este momento todos nuestros agentes de Información General están ocupados, pero estamos aquí para apoyarle. [...] le notificamos cuando haya un agente disponible.

**New:**
> ¡Gracias por contactarnos! ℹ️ En este momento los especialistas de Información General están apoyando a otras personas, pero su consulta nos importa y queremos atenderle. [...] le notificamos en cuanto un agente de Información General esté disponible.

**Why:** Added empathy phrase "su consulta nos importa y queremos atenderle". Department name added to wait option.

---

## 7. agente_disp_PRH

**Old:**
> ¡Bienvenido de vuelta a casa! 🏡 Hay un agente del Plan Retorno al Hogar disponible y listo para acompañarle en este proceso. [...] En un momento le conectamos con nuestro equipo especializado. ¡Estamos con usted! 😊

**New:**
> ¡Bienvenido de vuelta a casa! 🏡 Un agente del Plan Retorno al Hogar está disponible y listo para acompañarle en cada paso de este proceso. [...] En un momento nuestro equipo del Plan Retorno al Hogar le recibe con todo el apoyo que merece. ¡Estamos con usted! 😊

**Why:** Full department name in closing instead of generic "equipo especializado". Added "con todo el apoyo que merece" — especially meaningful for returned migrants.

---

## 8. agente_no_disp_PRH

**Old:**
> Entendemos que su proceso de retorno es muy importante para usted. 🏡 En este momento nuestros agentes del Plan Retorno al Hogar están apoyando a otras personas, pero pronto podrán atenderle. [...] le notificamos cuando haya un agente disponible.

**New:**
> Entendemos que su proceso de retorno es muy importante para usted. 🏡 En este momento los agentes del Plan Retorno al Hogar están acompañando a otras personas, pero pronto podrán estar con usted. [...] le notificamos cuando un agente del Plan Retorno al Hogar esté disponible.

**Why:** "apoyando" → "acompañando" (more human word for a vulnerable context). Department name added to wait option text. "pronto podrán estar con usted" is warmer than "pronto podrán atenderle".

---

## 9. agente_disp_ControlMigratorio  ⭐ Critical fix

**Old (contained "transfiriendo"):**
> ¡Buenas noticias! 🛃 Hay un agente de Control Migratorio disponible para atenderle en este momento. [...] Le estamos transfiriendo ahora. ¡Gracias por su paciencia! 😊

**New:**
> ¡Excelente noticia! 🛃 Un especialista de Control Migratorio está disponible para atenderle ahora mismo. [...] En un momento nuestro equipo de Control Migratorio le recibe. ¡Gracias por su confianza! 😊

**Why:** Removed "transfiriendo" (robotic, form-style language). Opening now says "Un especialista de Control Migratorio" for dept specificity. "paciencia" → "confianza" (more positive framing).

---

## 10. agente_no_disp_ControlMigratorio

**Old:**
> Gracias por contactar a Control Migratorio. 🛃 En este momento nuestros agentes están ocupados, pero no tardamos en poder atenderle. [...] le avisamos cuando un agente esté disponible.

**New:**
> Gracias por comunicarse con Control Migratorio. 🛃 En este momento los especialistas de Control Migratorio están atendiendo a otras personas, pero le atenderemos muy pronto. [...] le avisamos en cuanto un agente de Control Migratorio esté disponible.

**Why:** "nuestros agentes" → "los especialistas de Control Migratorio". Added "pero le atenderemos muy pronto" as reassurance. Department name in wait option.

---

## Patterns Applied

| Issue | Fix |
|---|---|
| Generic "transfiriendo" / "Le conectamos" | Replaced with dept-specific warm handover phrases |
| "No hay agentes" / abrupt no-agent messages | Added empathy + dept-specific self-service options |
| "Nuestros agentes" (anonymous) | Replaced with "Los especialistas de [Dept]" |
| Wait options without dept name | Dept name now appears in "le avisamos" text |
| Generic closings | Each block now has a unique, dept-appropriate sign-off |
