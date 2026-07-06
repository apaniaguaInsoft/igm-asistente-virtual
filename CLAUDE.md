# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

IGM Flow is a conversational flow visualizer and editor for the Instituto Guatemalteco de Migración (IGM) virtual assistant. It is deployed on Vercel and has two views:

- `/` — public read-only tree view of the chatbot flow
- `/admin` — authenticated editor that lets admins modify and publish the flow

## Development

No build step, no tests, no linter. To run locally:

```bash
npm install -g vercel
vercel dev
```

The only runtime dependency is `@upstash/redis` (used in `api/flow.js`).

## Architecture

### API: `api/flow.js`
A single Vercel serverless function (CommonJS `module.exports`) handling:
- `GET /api/flow` — reads `igm_flow` key from Vercel KV; seeds `DEFAULT_FLOW` on first run
- `POST /api/flow` — saves the JSON body to KV; requires `x-admin-token` header matching `process.env.ADMIN_TOKEN`
- `POST /api/flow/reset` — restores `DEFAULT_FLOW` to KV; same auth requirement

### Frontend: `public/`
Vanilla HTML/CSS/JS — no framework. Both pages are fully self-contained (CSS and JS are inlined).
- `index.html` — fetches `/api/flow`, renders the tree recursively via `buildNode()`, expand/collapse on click
- `admin.html` — same tree renderer plus: login screen (token stored in `sessionStorage`), slide-out editor panel, publish and reset actions; exposed at `/admin` via the rewrite in `vercel.json`

`buildNode()` is duplicated across both files. The admin version adds edit-mode buttons (Editar, ＋ hijo, ✕) and a different click handler — do not try to share it.

### Data model
The flow is a **recursive tree** of nodes stored as a single JSON object in Vercel KV under the key `igm_flow`. Each node has:

```js
{
  id: "1.2.3",          // dot-notation path, used as display label and DOM key
  label: "...",
  type: "menu" | "final" | "transfer" | "check" | "offline",
  cat: "root" | "pasaportes" | "extranjeria" | "control" | "info" | "agente" | "agente-*",
  intents: ["phrase1", "phrase2"],  // NLU trigger keywords
  detail: "HTML string shown as bot response",
  children: [/* nested nodes */]
}
```

`agentSubflow(dept, cat, idPrefix)` in `api/flow.js` is a factory that generates the standard 3-step human-handoff subtree (check schedule → check availability → transfer). It is called inline as an array element inside `children: [ ... ]` literals and returns a plain object.

### Live flow vs. DEFAULT_FLOW
`DEFAULT_FLOW` in `api/flow.js` is only the **seed/reset value**. Once KV has been written to, the live flow served to users comes from KV — editing `DEFAULT_FLOW` in code has no effect on production until an admin triggers "Resetear al original" or the KV key is deleted. To update content without going through the admin UI, push a code change and then reset via `/admin`.

### Auth
The admin token is validated server-side by comparing the `x-admin-token` request header against `process.env.ADMIN_TOKEN`. On the client, the token is verified by sending a test POST on login; it is then kept in `sessionStorage` for the browser session.

### CSS color system
Category colors are CSS custom properties defined in `:root` (`--pasaportes`, `--extranjeria`, `--control`, `--info`, `--agente`). Node elements get a `cat-<value>` class that maps to these vars. The `detail` panel uses a `detail-<cat>` class for matching background/border. Both files share the same color scheme via duplicated `:root` blocks.

## Deployment

Deployed automatically to Vercel on push to `main`. Required environment variables (set in Vercel project settings):
- `ADMIN_TOKEN` — any secret string for admin access
- `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN` — added automatically when a KV database is connected in the Vercel dashboard
