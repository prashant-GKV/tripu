# Tripu — AI Trip Planner + Travel Companion Matching

A hybrid travel app: plan a **map-backed, AI-generated itinerary** in minutes, browse public
tripboards without logging in, edit them together in real time, and find **travel companions** with
a compatible style/dates/budget. Built as a final-year capstone with a premium **"Aurora Glass"** UI.

> Inspired by competitor analysis (Rimigo) but deliberately beats it on: **maps**, **browse-before-login**,
> a **genuine AI engine**, **real-time collaboration**, **companion matching**, and an **installable PWA**.

- **Architecture:** [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Decision log (viva gold):** [DECISIONS.md](./DECISIONS.md)

## Tech stack

| Layer | Tech |
|---|---|
| Client | React 19, TypeScript, Vite, Tailwind (Aurora Glass), Framer Motion, React Router, Zustand, TanStack Query, **Leaflet** (maps), Socket.io-client, **vite-plugin-pwa**, jsPDF |
| Server | Node, **Fastify**, TypeScript, **Prisma**, **Socket.io**, JWT auth (email OTP + Google), Anthropic **Claude** |
| Database | **PostgreSQL** (via Docker) |

## Repository layout

```
Tripu/
├─ client/   React SPA (wizard, tripboard, maps, browse, PWA)
├─ server/   Fastify API (auth, trips, AI engine, matching, realtime)
├─ docker-compose.yml   local Postgres
├─ ARCHITECTURE.md  ·  DECISIONS.md
```

## Quick start

### 0. Prerequisites
- Node.js 20+
- **For the database:** Docker Desktop **+ WSL2**. On Windows Home, WSL2 is required and needs a
  one-time reboot (`wsl --install` then restart). *You can skip this and still demo the AI planner —
  see "Run without a database" below.*

### 1. Client
```bash
cd client
npm install
cp .env.example .env     # Windows: copy .env.example .env
npm run dev              # http://localhost:5173
```

### 2. Server
```bash
cd server
npm install
cp .env.example .env     # Windows: copy .env.example .env
npm run dev              # http://localhost:4000/health
```

### 3. Database (optional but needed for saving/browse/matching/collab)
```bash
# from the repo root, after WSL2 is installed + machine rebooted:
docker compose up -d
cd server
npm run prisma:migrate   # create + apply the schema
npm run db:seed          # sample destinations, testimonials, profiles, trips
```

## Run without a database or API key (instant demo)
The AI engine has a **deterministic local fallback**, so:
1. Start the client and server (steps 1 & 2 above — no DB, no keys).
2. Go to **`/plan`**, fill the 4-step wizard, click **"Generate preview ✨"**.
3. You get a full, structured, constraint-aware itinerary inline. No Postgres, no Anthropic key.

Add real AI by putting `ANTHROPIC_API_KEY=...` in `server/.env` (model defaults to
`claude-sonnet-4-6`). Saving trips, browsing `/tripboards`, matching, and collaboration need the DB.

## Key routes
| Route | What |
|---|---|
| `/` | Marketing landing |
| `/plan` | 4-step AI planning wizard |
| `/tripboards` | Public tripboard browser (no login) |
| `/t/:slug` | A tripboard: day-by-day plan + live map + budget + packing list + companion matches |

## Scripts
- **client:** `npm run dev | build | preview | lint | test`
- **server:** `npm run dev | typecheck | test | prisma:migrate | prisma:studio | db:seed`

## The three novel technical contributions (for the report/viva)
1. **AI itinerary engine** — Claude structured/JSON output → Zod validation (+repair retry) →
   geocoding → deterministic constraint enforcement (pace/budget/diet/occasion). Editable + re-generatable.
2. **Real-time collaboration** — Socket.io rooms (one per trip), presence + live activity edits.
3. **Companion-compatibility algorithm** — transparent weighted score over date overlap, destination
   & style Jaccard, budget and pace proximity, with an explainable breakdown.

## Status
All code typechecks, builds, lints, and tests green (client + server). The database is the only
piece gated on the one-time WSL2 reboot on this machine.
