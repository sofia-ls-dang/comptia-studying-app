-- CompTIA A+ Flashcards schema
-- Run this once against your database to create the tables:
--   psql -U postgres -d netplus_flashcards -f schema.sql

CREATE TABLE IF NOT EXISTS decks (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT, -- e.g. 'Hardware', 'Operating Systems', etc.
  exam_core TEXT, -- 'core1' (220-1201) or 'core2' (220-1202)
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cards (
  id SERIAL PRIMARY KEY,
  deck_id INTEGER NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  difficulty TEXT DEFAULT 'medium', -- 'easy' | 'medium' | 'hard'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS study_sessions (
  id SERIAL PRIMARY KEY,
  deck_id INTEGER NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS card_reviews (
  id SERIAL PRIMARY KEY,
  card_id INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  session_id INTEGER REFERENCES study_sessions(id) ON DELETE SET NULL,
  result TEXT NOT NULL CHECK (result IN ('pass', 'fail')),
  reviewed_at TIMESTAMP DEFAULT NOW()
);

-- Single-row table tracking overall study XP/level for the creature companion.
-- (No multi-user auth yet, so this is one shared progress record.)
CREATE TABLE IF NOT EXISTS progress (
  id INTEGER PRIMARY KEY DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO progress (id, xp, level) VALUES (1, 0, 1)
ON CONFLICT (id) DO NOTHING;

-- Seed A+ V15 (220-1201 / 220-1202) domains as starter decks, weighted by
-- their official exam percentage.
INSERT INTO decks (name, domain, exam_core, description) VALUES
  ('Mobile Devices', 'Mobile Devices', 'core1', '13% of exam: laptops, mobile OS, connectivity, sync'),
  ('Networking', 'Networking', 'core1', '23% of exam: IP addressing, ports/protocols, wireless, devices'),
  ('Hardware', 'Hardware', 'core1', '25% of exam: cables, connectors, RAM, storage, motherboards, printers'),
  ('Virtualization & Cloud Computing', 'Virtualization & Cloud Computing', 'core1', '11% of exam: cloud models, VMs, hypervisors'),
  ('Hardware & Network Troubleshooting', 'Hardware & Network Troubleshooting', 'core1', '28% of exam: troubleshooting methodology, hardware and connectivity issues'),
  ('Operating Systems', 'Operating Systems', 'core2', '28% of exam: Windows, macOS, Linux, command line, OS installation'),
  ('Security', 'Security', 'core2', '28% of exam: threats, Zero Trust, hardening, malware removal'),
  ('Software Troubleshooting', 'Software Troubleshooting', 'core2', '23% of exam: OS and application troubleshooting, malware symptoms'),
  ('Operational Procedures', 'Operational Procedures', 'core2', '21% of exam: documentation, safety, professionalism, scripting basics')
ON CONFLICT DO NOTHING;
