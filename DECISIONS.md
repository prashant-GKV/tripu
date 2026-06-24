# DECISIONS.md — Architecture & Technology Decision Log

> A running log of significant technical decisions, the options considered, and **why** we
> chose what we did. This is intentionally written for a final-year project viva: each entry
> should be defensible out loud.

Format: each decision is an ADR-lite entry — Context → Decision → Rationale → Alternatives → Status.

---

## ADR-000 — Product direction: hybrid AI planner + companion matching

- **Context.** The competitive target is Rimigo (AI "plan in minutes"). The existing codebase
  ("Traw") is a travel-**companion-matching** marketing site. The two are related but distinct.
- **Decision.** Build a **hybrid** product: an AI trip-planner (Rimigo's core strength) **plus** a
  travel-companion-matching layer that Rimigo does **not** have.
- **Rationale.** Matching is a genuine competitive moat *and* gives the project a second novel
  technical contribution (a compatibility-scoring algorithm) for academic depth.
- **Alternatives.** Pure planner (less differentiated); pure matching (drifts from the brief).
- **Status.** Accepted.

## ADR-001 — Preserve the existing frontend stack

- **Context.** Existing client is React 19 + TypeScript + Vite + Tailwind + Framer Motion — already
  well-structured (centralized types, design tokens, reusable component classes).
- **Decision.** Keep it. Build on it rather than rewrite.
- **Rationale.** "Don't rip out what works." The stack is modern and the conventions are clean.
- **Status.** Accepted.

## ADR-002 — Visual language: "Aurora Glass"

- **Context.** User wants a markedly better, premium "3D lucid" UI inspired by Traw + Rimigo but
  copying neither.
- **Decision.** A dark **Aurora Glass** system: deep-twilight base, soft aurora gradients
  (teal → violet → magenta), frosted-glass layered surfaces with depth/parallax, electric-cyan +
  warm-coral accents. Respect `prefers-reduced-motion`.
- **Rationale.** Immediately visible differentiator vs. Rimigo's flat design; "lucid 3D" without
  heavy WebGL cost.
- **Status.** Accepted.

## ADR-003 — Self-hosted backend (no BaaS)

- **Context.** We need auth, a database, realtime collaboration, and a server-side home for the
  Anthropic API key. Options were a managed BaaS (Supabase) or a self-hosted service.
- **Decision.** **Self-hosted**: Node + **Fastify** (TypeScript) API service, **PostgreSQL** via
  **Prisma** ORM, **Socket.io** for realtime, and **self-built auth** (email OTP / magic-link +
  Google OAuth).
- **Rationale.** Greater demonstrated engineering depth for the viva — we own auth, data, and
  realtime end-to-end rather than delegating them to a BaaS. The Anthropic key stays server-side.
- **Alternatives.** Supabase (faster, less novelty); serverless functions (more moving parts).
- **Trade-off accepted.** More setup/ops (local Postgres via Docker, our own auth) in exchange for
  control and depth.
- **Status.** Accepted.

## ADR-004 — AI itinerary engine = Anthropic Claude, structured output

- **Context.** The AI engine is the academic centerpiece and must not be a thin prompt wrapper.
- **Decision.** Anthropic **Claude** (default `claude-sonnet-4-6`, `claude-opus-4-8` quality
  toggle) called from the server with **tool-use / forced JSON** bound to a strict schema; output
  validated with **Zod**, geocoded, then **constraint-enforced** (budget, pace, diet, occasion)
  deterministically in post-processing. Every item is a DB row → fully editable + re-generatable.
- **Rationale.** Structured, constraint-aware, transparent (per-item rationale), and re-generatable
  — defensibly more than Rimigo's thin wrapper.
- **Status.** Accepted.

## ADR-005 — Maps: Leaflet + OpenStreetMap + Nominatim

- **Context.** Maps are Rimigo's single biggest gap and our flagship differentiator. Student budget.
- **Decision.** **Leaflet** (`react-leaflet`) with free OSM tiles and **Nominatim** geocoding.
- **Rationale.** Zero API key, zero cost; sufficient for route lines + day pins. Mapbox is an
  optional later upgrade for nicer tiles.
- **Status.** Accepted.

## ADR-006 — Client state: Zustand + TanStack Query

- **Decision.** **Zustand** for local UI/wizard state; **TanStack Query** for server data
  fetching/caching/optimistic edits.
- **Rationale.** Minimal ceremony; right tool per concern (client state vs. server cache).
- **Status.** Accepted.

## ADR-007 — Realtime collaboration: Socket.io

- **Decision.** **Socket.io** rooms (one room per trip) with presence + broadcast; conflict policy
  starts as last-write-wins at the item level.
- **Rationale.** Real multi-user editing (vs. Rimigo's mockup) without over-scoping CRDTs.
- **Status.** Accepted.

## ADR-008 — Honest data & limits

- **Decision.** Live OTA price APIs are paid → use a clearly-labeled **mock/simulated** price
  comparison (optionally one free-tier provider). All demo stats/testimonials are clearly **seed**
  data. No fabricated numbers presented as real.
- **Status.** Accepted.

## ADR-009 — Response envelopes unwrapped centrally in the client

- **Context.** The server returns single-key envelopes (`{ trip }`, `{ itinerary }`, `{ matches }`,
  `{ destinations }`, …). The client UI wants plain values.
- **Decision.** Unwrap in one place — `client/src/lib/tripApi.ts` — so every page/component works
  with bare values and the wire format stays explicit on the server.
- **Status.** Accepted.

## ADR-010 — Local DB requires WSL2 (Docker backend) on Windows Home

- **Context.** This machine is Windows 11 **Home** (no Hyper-V), and WSL2 was not installed. Docker
  Desktop's Linux engine needs WSL2, so `docker compose up` could not pull images until WSL2 is
  present (which requires a one-time reboot).
- **Decision.** Keep Docker+Postgres (ADR-003). `wsl --install` has been run; the user reboots once,
  then `docker compose up -d` + `prisma migrate` + `db:seed` work. A native-Postgres path is
  documented as an alternative in the README.
- **Mitigation.** The headline feature (AI itinerary generation via `/plan` → *Generate preview*)
  works with NO database and NO API key, so the app demos immediately.
- **Status.** Accepted.

## ADR-011 — PWA via vite-plugin-pwa with an SVG app icon

- **Decision.** `vite-plugin-pwa` (generateSW, autoUpdate, `injectRegister: 'auto'`) with an
  Aurora-themed SVG icon. Build emits `sw.js` + `manifest.webmanifest` (installable + offline).
- **Follow-up.** Add rasterised PNG 192/512 icons for maximum cross-browser install fidelity.
- **Status.** Accepted.

---

_Append new decisions below as the build progresses._
