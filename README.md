# CompTIA A+ Flashcards

> Full-stack flashcard study app for CompTIA A+ (Core 1: 220-1201, Core 2: 220-1202) exam prep, built with React, Node.js/Express, and PostgreSQL.

🔗 **Repo:** [github.com/sofia-ls-dang/comptia-studying-app](https://github.com/sofia-ls-dang/comptia-studying-app)

---

## Overview

A study tool built around active recall for the CompTIA A+ exams. Decks are organized by official exam domain (Core 1 and Core 2, each weighted by its actual exam percentage), cards support full CRUD through the browser, and an XP/leveling system that rewards consistent review sessions.

---

## ✨ Features

- **Domain-organized decks** - Core 1 and Core 2 decks grouped separately, each labeled with its real exam weight (e.g. Hardware 25%, Security 28%)
- **Full card management** - add, edit, and delete cards per deck through a custom UI, with a confirm-dialog modal instead of the browser's native popup
- **3D flip-card study mode** - CSS `transform-style: preserve-3d` flip animation between question and answer, with a session progress bar
- **XP/leveling system** - reviewing a card ("knew it" / "didn't know it") awards XP server-side
- **Dockerized Postgres + API**- one-command local setup via Docker Compose

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite), React Router |
| Styling | CSS3 (custom properties, 3D transforms, keyframe animations) |
| Backend | Node.js + Express (REST API) |
| Database | PostgreSQL - raw SQL via `pg`, no ORM |
| Dev Server | Docker Compose (Postgres + Express containers) |
| Deployment | Local only (see Setup) |
| Fonts | Tilt Warp (Google Fonts) |

---

## 📝 Sections

- **Deck List** - Core 1 / Core 2 decks grouped by section, each showing its exam weight and topic summary
- **Deck Detail** - add, edit, and delete cards within a deck
- **Study Session** - flip-card review mode with pass/fail tracking and a session progress bar
- **Progress Widget** - persistent header showing current level and XP bar

---

## ⚙️ Setup

### With Docker (recommended - runs Postgres + the API)

```bash
# Clone the repo
git clone https://github.com/sofia-ls-dang/comptia-studying-app.git
cd comptia-studying-app

# Start Postgres + API
docker compose up --build

# In a second terminal, start the frontend
cd frontend
npm install
npm run dev

# Open in browser
http://localhost:5173
```

### Without Docker

1. Install PostgreSQL locally and create a database:
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
3. Frontend, in a separate terminal:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

> Note: if you're updating from an older clone of this repo, check `backend/db/` for numbered `migration_*.sql` files - each one needs to be run once against your existing database to pick up schema changes (the XP/progress table, the A+ deck restructure, etc).

---

## 🗂️ Project Structure

```
comptia-studying-app/
├── backend/
│   ├── db/
│   │   ├── schema.sql              # Table definitions + seeded A+ decks
│   │   └── migration_*.sql         # Incremental migrations for existing databases
│   ├── routes/
│   │   ├── decks.js                # Deck CRUD endpoints
│   │   ├── cards.js                # Card CRUD + review/XP endpoint
│   │   └── progress.js             # XP/level endpoint + leveling formula
│   ├── server.js
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/api.js              # Fetch wrapper for the backend
│   │   ├── components/
│   │   │   ├── Creature.jsx        # Original SVG creature, 4 evolution stages - in-progress
│   │   │   ├── ConfirmModal.jsx    # Custom delete-confirmation dialog
│   │   │   ├── Header.jsx          # Persistent nav + XP widget
│   │   │   └── LevelUpToast.jsx
│   │   ├── context/ProgressContext.jsx  # Shared XP/level state across pages
│   │   ├── pages/
│   │   │   ├── DeckList.jsx
│   │   │   ├── DeckDetail.jsx
│   │   │   └── StudySession.jsx
│   │   └── utils/xp.js             # Client-side XP/level math
│   └── vite.config.js
└── docker-compose.yml
```

---

## 🖋 What I Learned Building This

- **Raw SQL over an ORM** - writing parameterized queries directly with `pg` instead of Prisma/Sequelize, to build a real understanding of the SQL underneath before abstracting it away
- **PostgreSQL transactions** - using `BEGIN`/`COMMIT`/`ROLLBACK` so a card review and its XP update either both succeed or both fail, keeping the two in sync
- **REST API design** - structuring nested routes (`/decks/:id/cards`, `/cards/:id/review`) and separating concerns across route files
- **React Context** - sharing XP/level state across pages (header, study session) without prop-drilling
- **CSS 3D transforms** - building the flip-card animation with `perspective` and `backface-visibility` instead of a library
- **Docker Compose** - orchestrating a Postgres container and a Node API container together for reproducible local development

---

## 📫 Contact

**Sofia Dang**
- Portfolio: [sofia-ls-dang.github.io/Website-Portfolio](https://sofia-ls-dang.github.io/Website-Portfolio)
- LinkedIn: [linkedin.com/in/sofia-dang-7022252a3](https://linkedin.com/in/sofia-dang-7022252a3)
- GitHub: [github.com/sofia-ls-dang](https://github.com/sofia-ls-dang)
