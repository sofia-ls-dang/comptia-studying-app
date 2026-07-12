-- Run this if you already ran migration_002 (so your decks have descriptions
-- like "Core 1 - 13% of exam: ..."). This strips the redundant "Core 1 - " /
-- "Core 2 - " prefix since the deck list already groups decks under Core 1
-- / Core 2 section headings.
--
--   docker compose cp backend/db/migration_003_trim_descriptions.sql db:/tmp/migration3.sql
--   docker compose exec db psql -U postgres -d netplus_flashcards -f /tmp/migration3.sql

UPDATE decks
SET description = regexp_replace(description, '^Core [12] - ', '')
WHERE description ~ '^Core [12] - ';
