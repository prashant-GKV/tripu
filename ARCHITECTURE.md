# ARCHITECTURE.md

> System architecture for the hybrid **AI trip-planner + travel-companion-matching** web app.
> Companion doc: [DECISIONS.md](./DECISIONS.md) (the *why* behind each choice).

## 1. Problem statement & objectives

Travellers are stuck between OTAs (good at booking, poor at planning), travel agents (good at
planning, slow/expensive), and generic AI chatbots (smart but not connected to real structure).
This project delivers an **AI-powered planner** that produces a structured, editable, **map-backed**
itinerary in minutes, **plus** a **companion-matching** layer that connects travellers with
compatible style, dates, and budget — a capability competitors (e.g. Rimigo) lack.

**Objectives**

1. A 4-step planning wizard that captures a complete trip brief.
2. A genuine, constraint-aware **AI itinerary engine** (structured JSON, editable, re-generatable).
3. A **map-first** tripboard (route + day pins) — browsable **without login**.
4. **Real-time collaborative** editing.
5. A transparent **companion-compatibility** algorithm.
6. An installable **PWA** with offline itinerary + PDF export.

## 2. High-level architecture (self-hosted)

```
┌──────────────────────────────────────────────────────────────┐
│  CLIENT  (client/ — Vite SPA)                                │
│  React 19 · TS · Tailwind (Aurora Glass) · Framer Motion     │
│  React Router v7 · Zustand · TanStack Query                  │
│  React-Leaflet (maps) · socket.io-client · vite-plugin-pwa   │
└───────────────┬───────────────────────────┬──────────────────┘
                │ REST + WebSocket            │ map tiles / geocode
                ▼                             ▼
┌────────────────────────────────────┐   ┌────────────────────────┐
│  SERVER  (server/ — self-hosted)   │   │ OpenStreetMap tiles     │
│  Node · Fastify · TypeScript       │   │ Nominatim (geocoding)   │
│  ─ Auth (email OTP/magic-link,     │   └────────────────────────┘
│    Google OAuth, JWT sessions)     │
│  ★ AI Itinerary Engine (Claude)    │   ┌────────────────────────┐
│  ★ Companion-Match Algorithm       │──▶│ Anthropic Claude API   │
│  ─ Socket.io (realtime collab)     │   │ (key server-side only) │
│  ─ Price-compare (mock/free-tier)  │   └────────────────────────┘
│  ─ Prisma ORM                      │
└───────────────┬────────────────────┘
                │ SQL
                ▼
        ┌────────────────┐
        │ PostgreSQL     │  (local via docker-compose)
        └────────────────┘
```

★ = the project's novel technical contributions.

## 3. Components

| Component | Tech | Responsibility |
|---|---|---|
| Client SPA | React 19 + Vite | Wizard, tripboard, maps, browse, collaboration UI, PWA shell |
| API service | Fastify + TS | REST endpoints, auth, AI engine, matching, realtime hub |
| AI engine | Claude + Zod | Structured itinerary generation + validation + constraint enforcement |
| Matching | TS module | Deterministic, explainable compatibility scoring |
| Realtime | Socket.io | Trip rooms, presence, live edits |
| Persistence | PostgreSQL + Prisma | Trips, days, activities, profiles, collaborators, matches |

## 4. Data model

See [`server/prisma/schema.prisma`](server/prisma/schema.prisma). Core entities:
`Profile · Trip · TripCity · Day · Activity · Accommodation · Collaborator · CompanionMatch ·
PriceQuote · Destination · Testimonial`. Public trips are world-readable (browse-before-login);
private trips are restricted to the owner + accepted collaborators (enforced in the API layer).

## 5. AI itinerary pipeline

`TripBrief (wizard) → Claude (JSON tool-use) → Zod validate (+1 repair retry) → geocode (Nominatim)
→ constraint enforcement (budget/pace/diet/occasion) → persist (rows) → client`.

Editing = row updates. "Regenerate day" re-prompts Claude scoped to one day with locked constraints
and the rest of the trip as context.

## 6. Companion-matching algorithm

`score(0–100) = weighted_sum(date_overlap, destination_overlap, style_jaccard, budget_proximity,
pace_match)` with a stored, human-readable `breakdown` per candidate. Deterministic and unit-tested.

## 7. Repository layout (target)

```
d:/Tripu/
├─ client/                 React SPA (existing, upgraded)
├─ server/                 Fastify API
│  ├─ prisma/schema.prisma data model + migrations
│  └─ src/                 config, db, app, routes
├─ docker-compose.yml      local Postgres
├─ DECISIONS.md
└─ ARCHITECTURE.md
```

## 8. Milestones

M0 Foundation → M1 Wizard → M2 AI engine → M3 Tripboard+Maps → M4 Companion matching →
M5 Collaboration → M6 PWA+export → M7 polish/docs/demo. See DECISIONS.md / project board for the
definition of done per milestone.
