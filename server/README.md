# Tripu — Server

Self-hosted API for the Tripu hybrid AI trip-planner + travel-companion-matching app.

**Stack:** Node · Fastify · TypeScript · Prisma · PostgreSQL · (Socket.io + Anthropic Claude land in later milestones).

## Prerequisites

- Node.js 20+ (you have v24)
- **Docker Desktop** (for local Postgres) — https://www.docker.com/products/docker-desktop/

## First-time setup

```bash
# 1. From the repo root, start Postgres
docker compose up -d

# 2. In server/, create your env file and fill in secrets
cp .env.example .env        # (Windows PowerShell: copy .env.example .env)

# 3. Install deps (already done if you ran npm install)
npm install

# 4. Generate the Prisma client + create the database schema
npm run prisma:generate
npm run prisma:migrate      # creates the first migration & applies it

# 5. Run the server (hot-reload)
npm run dev
```

Verify it's up:

```bash
curl http://localhost:4000/health      # process liveness
curl http://localhost:4000/health/db   # confirms Postgres connectivity
```

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Fastify with hot-reload (tsx watch) |
| `npm run start` | Run without watch |
| `npm run typecheck` / `build` | `tsc --noEmit` |
| `npm run test` | Vitest (uses an in-test env; no real DB needed for unit tests) |
| `npm run prisma:generate` | Regenerate Prisma client after schema changes |
| `npm run prisma:migrate` | Create/apply a dev migration |
| `npm run prisma:studio` | Browse the DB in Prisma Studio |
| `npm run db:seed` | Seed demo/sample content (added with seed data) |

## Layout

```
server/
├─ prisma/schema.prisma   data model (see ../ARCHITECTURE.md)
├─ src/
│  ├─ config.ts           Zod-validated environment
│  ├─ db.ts               shared Prisma client
│  ├─ app.ts              Fastify app builder (CORS + routes)
│  ├─ index.ts            entrypoint + graceful shutdown
│  └─ routes/health.ts    /health, /health/db
└─ .env.example
```

## Security notes

- `ANTHROPIC_API_KEY`, `JWT_SECRET`, and OAuth secrets live **only** in `.env` (gitignored) and are
  never sent to the browser. The AI engine runs server-side exclusively.
- Replace `JWT_SECRET` and DB credentials before any non-local deployment.
