-- Run this if your database still has the old Network+ domain decks
-- (Networking Fundamentals, Network Implementations, etc.) and you want
-- to switch to CompTIA A+ Core 1 / Core 2 decks instead.
--
--   docker compose cp backend/db/migration_002_a_plus_decks.sql db:/tmp/migration2.sql
--   docker compose exec db psql -U postgres -d netplus_flashcards -f /tmp/migration2.sql
--
-- WARNING: this deletes the old Network+ decks AND any cards inside them
-- (cards cascade-delete with their deck). If you added real study content
-- to those decks and want to keep it, back it up first.

ALTER TABLE decks ADD COLUMN IF NOT EXISTS exam_core TEXT;

DELETE FROM decks WHERE name IN (
  'Networking Fundamentals',
  'Network Implementations',
  'Network Operations',
  'Network Security',
  'Network Troubleshooting'
);

INSERT INTO decks (name, domain, exam_core, description)
SELECT 'Mobile Devices', 'Mobile Devices', 'core1', '13% of exam: laptops, mobile OS, connectivity, sync'
WHERE NOT EXISTS (SELECT 1 FROM decks WHERE name = 'Mobile Devices');

INSERT INTO decks (name, domain, exam_core, description)
SELECT 'Networking', 'Networking', 'core1', '23% of exam: IP addressing, ports/protocols, wireless, devices'
WHERE NOT EXISTS (SELECT 1 FROM decks WHERE name = 'Networking');

INSERT INTO decks (name, domain, exam_core, description)
SELECT 'Hardware', 'Hardware', 'core1', '25% of exam: cables, connectors, RAM, storage, motherboards, printers'
WHERE NOT EXISTS (SELECT 1 FROM decks WHERE name = 'Hardware');

INSERT INTO decks (name, domain, exam_core, description)
SELECT 'Virtualization & Cloud Computing', 'Virtualization & Cloud Computing', 'core1', '11% of exam: cloud models, VMs, hypervisors'
WHERE NOT EXISTS (SELECT 1 FROM decks WHERE name = 'Virtualization & Cloud Computing');

INSERT INTO decks (name, domain, exam_core, description)
SELECT 'Hardware & Network Troubleshooting', 'Hardware & Network Troubleshooting', 'core1', '28% of exam: troubleshooting methodology, hardware and connectivity issues'
WHERE NOT EXISTS (SELECT 1 FROM decks WHERE name = 'Hardware & Network Troubleshooting');

INSERT INTO decks (name, domain, exam_core, description)
SELECT 'Operating Systems', 'Operating Systems', 'core2', '28% of exam: Windows, macOS, Linux, command line, OS installation'
WHERE NOT EXISTS (SELECT 1 FROM decks WHERE name = 'Operating Systems');

INSERT INTO decks (name, domain, exam_core, description)
SELECT 'Security', 'Security', 'core2', '28% of exam: threats, Zero Trust, hardening, malware removal'
WHERE NOT EXISTS (SELECT 1 FROM decks WHERE name = 'Security');

INSERT INTO decks (name, domain, exam_core, description)
SELECT 'Software Troubleshooting', 'Software Troubleshooting', 'core2', '23% of exam: OS and application troubleshooting, malware symptoms'
WHERE NOT EXISTS (SELECT 1 FROM decks WHERE name = 'Software Troubleshooting');

INSERT INTO decks (name, domain, exam_core, description)
SELECT 'Operational Procedures', 'Operational Procedures', 'core2', '21% of exam: documentation, safety, professionalism, scripting basics'
WHERE NOT EXISTS (SELECT 1 FROM decks WHERE name = 'Operational Procedures');
