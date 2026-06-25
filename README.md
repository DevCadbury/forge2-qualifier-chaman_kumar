# Forge 2 Qualifier — Trello-Style Kanban Board

A tiny Kanban board built by a two-agent team (Hermes brain + OpenClaw hands) communicating through Slack, shipped as part of the Forge 2 Qualifier.

**Live URL**: https://forge2-qualifier-chaman-kumar.vercel.app/ *(frontend — Vercel)*  
**API URL**: https://forge2-qualifier-chaman.up.railway.app *(backend — Railway)*  
**GitHub Repo**: https://github.com/chaman-kumar/forge2-qualifier-chaman

---

## What This App Does

A Trello-style Kanban board where teams can manage projects end-to-end:

- **Boards**: Create multiple boards for different projects, each with a custom color
- **Lists**: Columns inside a board (To-Do / Doing / Done or anything you name)
- **Cards**: Tasks inside lists — each card has a title and description you can edit
- **Move Cards**: Move a card from one list to another in one click
- **Tags / Labels**: Create colored tags (bug, design, urgent) and attach them to cards
- **Members**: Add people to the board and assign them to individual cards
- **Due Dates**: Set a deadline on any card; overdue cards turn red, due-soon cards turn yellow

---

## Models & Why

### Board
- Fields: `id`, `name`, `description`, `color`, timestamps
- One board has many lists
- Reason: top-level container per project; color helps distinguish boards visually

### BoardList
- Fields: `id`, `board_id`, `name`, `position`, timestamps
- Belongs to a board; has many cards
- Reason: `position` column keeps list order user-controlled without relying on insert order

### Card
- Fields: `id`, `list_id`, `title`, `description`, `position`, `due_date`, timestamps
- Belongs to a list; many-to-many with Tag and Member
- Reason: `due_date` is nullable so it's optional; `position` enables ordering within a list

### Tag
- Fields: `id`, `name`, `color`, timestamps
- Many-to-many with Card via `card_tag` pivot
- Reason: tags are reusable across cards; a single card can carry multiple labels

### Member
- Fields: `id`, `name`, `email`, `avatar`, timestamps
- Many-to-many with Card via `card_member` pivot
- Reason: lightweight people model — no auth needed for a qualifier build; avatar for visual identity

### Pivot: card_tag and card_member
- Both have a unique constraint on their pair to prevent duplicate assignments
- Reason: database-level guard is cheaper than application-level duplicate checks

---

## Which Models the Agents Used

Hermes (brain) planned the schema in `#sprint-main`, broke it into tasks, and posted each task to `#agent-coder`.  
OpenClaw (hands) ran `php artisan make:model`, created migrations, wrote controllers, and reported back.

---

## Technology Stack

| Layer | Tool | Why |
|---|---|---|
| Backend | Laravel 11, PHP 8.3 | Excellent ORM, built-in validation, easy REST |
| Database | SQLite | Zero config, file-based, perfect for development |
| Frontend | React 19 + Vite | Fast HMR, modern tooling, great DX |
| HTTP | Axios | Simple, promise-based API client |
| UI | Ant Design 5 | Production-ready components, CSS-in-JS (no import issues) |
| Dates | dayjs + date-fns | Lightweight, chainable |
| Brain agent | Hermes (NousResearch) | Persistent memory, skill system, cron scheduling |
| Hands agent | OpenClaw | Writes and runs code in response to chat |
| Comms | Slack (Socket Mode) | Human-in-the-loop; all agent activity visible in one place |
| Model (Hermes) | Ollama `rafw007/qwen35-claude-coder:4b` | Free, local, no API billing |
| Model (OpenClaw) | Ollama `rafw007/qwen35-claude-coder:4b` | Same model; fast for code generation |

### Why this model routing?

Both agents use the same local Ollama model (`rafw007/qwen35-claude-coder:4b`). Running locally means no rate limits, no billing, and full offline capability. For a qualifier build with tight iteration loops this beats remote free-tier throttling. Hermes uses it for planning and decomposition; OpenClaw uses it for code generation and execution. A stronger remote model (Groq `openai/gpt-oss-120b`) can replace the planning layer if latency becomes an issue on longer tasks.

---

## Run Instructions

### Option A — Docker (recommended, matches production)

Requires Docker Desktop.

```bash
# From repo root — builds backend image, starts both services
docker compose up --build
```

- Backend API: `http://localhost:8080/api/v1`
- Frontend: `http://localhost:5173`

### Option B — Local (PHP + Node)

**Prerequisites**: PHP 8.2+, Composer, Node.js 16+

```bash
# Terminal 1 — Laravel API
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite        # Windows: type nul > database\database.sqlite
php artisan migrate
php artisan serve --port=8000

# Terminal 2 — React frontend
cd frontend
npm install
npm run dev
```

- Backend API: `http://localhost:8000/api/v1`
- Frontend: `http://localhost:5173`

Quick smoke test:
```bash
curl http://localhost:8000/api/v1/boards
# Expected: []
```

---

## API Reference

### Boards
```
GET    /api/v1/boards
POST   /api/v1/boards
GET    /api/v1/boards/{id}
PUT    /api/v1/boards/{id}
DELETE /api/v1/boards/{id}
```

### Lists
```
GET    /api/v1/boards/{id}/lists
POST   /api/v1/boards/{id}/lists
PUT    /api/v1/boards/{id}/lists/{lid}
DELETE /api/v1/boards/{id}/lists/{lid}
PATCH  /api/v1/boards/{id}/lists/{lid}/move
```

### Cards
```
GET    /api/v1/boards/{id}/lists/{lid}/cards
POST   /api/v1/boards/{id}/lists/{lid}/cards
GET    /api/v1/boards/{id}/lists/{lid}/cards/{cid}
PUT    /api/v1/boards/{id}/lists/{lid}/cards/{cid}
DELETE /api/v1/boards/{id}/lists/{lid}/cards/{cid}
PATCH  /api/v1/boards/{id}/lists/{lid}/cards/{cid}/move
```

### Tags
```
GET    /api/v1/tags
POST   /api/v1/tags
PUT    /api/v1/tags/{id}
DELETE /api/v1/tags/{id}
POST   /api/v1/cards/{cid}/tags/{tid}
DELETE /api/v1/cards/{cid}/tags/{tid}
```

### Members
```
GET    /api/v1/members
POST   /api/v1/members
PUT    /api/v1/members/{id}
DELETE /api/v1/members/{id}
POST   /api/v1/cards/{cid}/members/{mid}
DELETE /api/v1/cards/{cid}/members/{mid}
```

---

## Project Structure

```
forge/
├── backend/
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── BoardController.php
│   │   │   ├── ListController.php
│   │   │   ├── CardController.php
│   │   │   ├── TagController.php
│   │   │   └── MemberController.php
│   │   └── Models/
│   │       ├── Board.php
│   │       ├── BoardList.php
│   │       ├── Card.php
│   │       ├── Tag.php
│   │       └── Member.php
│   ├── database/migrations/     # 7 migration files
│   ├── routes/api.php
│   ├── .env.example
│   └── composer.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BoardForm.jsx
│   │   │   ├── BoardView.jsx
│   │   │   ├── CardDetailsModal.jsx
│   │   │   ├── CardView.jsx
│   │   │   ├── ListView.jsx
│   │   │   ├── MemberManager.jsx
│   │   │   └── TagManager.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── skills/
│   └── status-report/
│       └── SKILL.md
│
├── README.md
├── ARCHITECTURE.md
├── agent-log.md
└── .env.example
```

---

## Features

### Required (all working)
- Boards → Lists → Cards with full CRUD
- Move a card between lists
- Edit card title and description
- Colored tags assigned to cards
- Assign members to cards
- Due dates with overdue / due-soon visual flags

### Additional
- Custom board colors
- Member avatars
- Confirmation dialogs before delete
- Success / error toast notifications
- Loading and empty states
