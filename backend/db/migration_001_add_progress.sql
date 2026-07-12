-- Run this if your database was created BEFORE the progress/XP feature was added.
-- (Docker only runs schema.sql automatically on a brand-new database volume, so if
-- you already have decks/cards, run this file instead to add the new table.)
--
--   psql -U postgres -d netplus_flashcards -f migration_001_add_progress.sql
--
-- or, with Docker running:
--   docker compose exec -T db psql -U postgres -d netplus_flashcards -f - < backend/db/migration_001_add_progress.sql

CREATE TABLE IF NOT EXISTS progress (
  id INTEGER PRIMARY KEY DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO progress (id, xp, level) VALUES (1, 0, 1)
ON CONFLICT (id) DO NOTHING;
