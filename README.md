# CompTIA A+ Flashcards

A full-stack flashcard app for studying toward CompTIA A+ (Core 1: 220-1201, Core 2: 220-1202).

**Stack:** React (Vite) + Node.js/Express + PostgreSQL

## Project structure

```
flashcard-app/
  backend/          Express API + raw SQL queries (pg)
    db/
      schema.sql    Table definitions + seed data (5 N10-009 domains)
      pool.js       Postgres connection pool
    routes/
      decks.js      /api/decks endpoints
      cards.js      /api/decks/:id/cards and /api/cards/:id endpoints
    server.js
    Dockerfile
  frontend/         React app (Vite)
    src/
      api/api.js         fetch wrapper for the backend
      components/
        Flashcard.jsx     click-to-flip card
      pages/
        DeckList.jsx      list of decks
        StudySession.jsx  study mode with pass/fail tracking
      App.jsx
      main.jsx
  docker-compose.yml   Postgres + API containers
```

## Option A: Run with Docker (recommended, matches your portfolio site setup)

```bash
cd flashcard-app
docker compose up --build
```

This starts Postgres (seeded with schema.sql automatically) and the API on port 4000.

Then run the frontend separately (Vite dev server isn't in Docker here, so hot reload stays fast):

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173. Vite's dev server proxies `/api` calls to `localhost:4000` (see `vite.config.js`).

## Option B: Run without Docker

1. Install Postgres locally, create a database:
   ```bash
   createdb netplus_flashcards
   psql -d netplus_flashcards -f backend/db/schema.sql
   ```
2. Backend:
   ```bash
   cd backend
   cp .env.example .env   # edit if your Postgres credentials differ
   npm install
   npm run dev
   ```
3. Frontend (separate terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Updating an existing database (XP/creature feature)

If you already ran `docker compose up` before and have decks/cards in your database, the new `progress` table won't exist yet (Docker only auto-runs `schema.sql` on a brand-new, empty database volume). Run the migration once:

```bash
docker compose exec -T db psql -U postgres -d netplus_flashcards -f - < backend/db/migration_001_add_progress.sql
```

(Or, without Docker: `psql -d netplus_flashcards -f backend/db/migration_001_add_progress.sql`)

If you'd rather start fresh instead, `docker compose down -v` wipes the volume so `schema.sql` (which now includes the progress table) runs again from scratch on next `up`.

## Next steps to build on this scaffold

- **Add a deck/card editor UI** — currently decks and cards can only be created via the API (e.g. with `curl` or Postman); a form in React would let you manage content without leaving the browser.
- **Spaced repetition** — the `card_reviews` table already logs pass/fail per card. You could implement something like the SM-2 algorithm to resurface cards you've failed more often.
- **Auth** — if you want to deploy this publicly and track your own progress separately from anyone else using it, add a `users` table and basic session/JWT auth.
- **Deploy** — Render or Railway both support a Postgres + Node service for free/cheap; point your portfolio site at the deployed URL as a live project link.
