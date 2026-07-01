# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

IGM Flow is a conversational flow visualizer and editor for the Instituto Guatemalteco de Migración (IGM) virtual assistant. It is deployed on Vercel and has two views:

- `/` — public read-only tree view of the chatbot flow
- `/admin` — authenticated editor that lets admins modify and publish the flow

## Development

There is no local dev server configured. To run locally, install the Vercel CLI and use:

```bash
npm install -g vercel
vercel dev
```

This project has no build step, no tests, and no linter. The only dependency is `@vercel/kv`.

## Architecture

### API: `api/flow.js`
A single Vercel serverless function (ESM `export default`) handling:
- `GET /api/flow` — reads `igm_flow` key from Vercel KV; seeds `DEFAULT_FLOW` on first run
- `POST /api/flow` — saves the JSON body to KV; requires `x-admin-token` header matching `process.env.ADMIN_TOKEN`
- `POST /api/flow/reset` — restores `DEFAULT_FLOW` to KV; same auth requirement

### Frontend: `public/`
Vanilla HTML/CSS/JS — no framework.
- `index.html` — fetches `/api/flow`, renders the tree recursively via `buildNode()`, expand/collapse on click
- `admin.html` — same tree renderer plus: login screen (token stored in `sessionStorage`), slide-out editor panel, publish and reset actions; exposed at `/admin` via the rewrite in `vercel.json`

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

`agentSubflow(dept, cat, idPrefix)` in `api/flow.js` is a factory that generates the standard 3-step human-handoff subtree (check schedule → check availability → transfer). It is used to insert consistent agent nodes across all departments.

### Auth
The admin token is validated server-side by comparing the `x-admin-token` request header against `process.env.ADMIN_TOKEN`. On the client, the token is verified by sending a test POST on login; it is then kept in `sessionStorage` for the browser session.

## Deployment

Deployed automatically to Vercel on push to `main`. Required environment variables (set in Vercel project settings):
- `ADMIN_TOKEN` — any secret string for admin access
- Vercel KV variables (`KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`) — added automatically when a KV database is connected in the Vercel dashboard
