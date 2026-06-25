# Kanban Board API

Laravel 10 + SQLite RESTful API for Kanban Board management.

## Features

- **Boards**: CRUD operations for Kanban boards
- **Lists**: Create columns/lists within boards
- **Cards**: Task cards with move functionality
- **Tags**: Label and categorize cards
- **Members**: Assign team members to cards
- **Due Dates**: Track card deadlines

## API Endpoints

### Boards
```
GET    /api/v1/boards                      - List all boards
POST   /api/v1/boards                      - Create board
GET    /api/v1/boards/{id}                 - Get board details
PUT    /api/v1/boards/{id}                 - Update board
DELETE /api/v1/boards/{id}                 - Delete board
```

### Lists
```
GET    /api/v1/boards/{id}/lists           - Get all lists in board
POST   /api/v1/boards/{id}/lists           - Create list
GET    /api/v1/boards/{id}/lists/{lid}     - Get list details
PUT    /api/v1/boards/{id}/lists/{lid}     - Update list
DELETE /api/v1/boards/{id}/lists/{lid}     - Delete list
PATCH  /api/v1/boards/{id}/lists/{lid}/move - Move list position
```

### Cards
```
GET    /api/v1/boards/{id}/lists/{lid}/cards           - Get all cards in list
POST   /api/v1/boards/{id}/lists/{lid}/cards           - Create card
GET    /api/v1/boards/{id}/lists/{lid}/cards/{cid}     - Get card details
PUT    /api/v1/boards/{id}/lists/{lid}/cards/{cid}     - Update card
DELETE /api/v1/boards/{id}/lists/{lid}/cards/{cid}     - Delete card
PATCH  /api/v1/boards/{id}/lists/{lid}/cards/{cid}/move - Move card to another list
```

### Tags
```
GET    /api/v1/tags                        - List all tags
POST   /api/v1/tags                        - Create tag
GET    /api/v1/tags/{id}                   - Get tag details
PUT    /api/v1/tags/{id}                   - Update tag
DELETE /api/v1/tags/{id}                   - Delete tag

POST   /api/v1/cards/{cid}/tags/{tid}      - Attach tag to card
DELETE /api/v1/cards/{cid}/tags/{tid}      - Remove tag from card
```

### Members
```
GET    /api/v1/members                     - List all members
POST   /api/v1/members                     - Create member
GET    /api/v1/members/{id}                - Get member details
PUT    /api/v1/members/{id}                - Update member
DELETE /api/v1/members/{id}                - Delete member

POST   /api/v1/cards/{cid}/members/{mid}   - Assign member to card
DELETE /api/v1/cards/{cid}/members/{mid}   - Remove member from card
```

### Due Dates
```
PUT    /api/v1/cards/{cid}/due-date        - Set/update card due date
DELETE /api/v1/cards/{cid}/due-date        - Remove due date
```

## Installation

### Prerequisites
- PHP 8.1+
- Composer
- SQLite (bundled with PHP)

### Setup Steps

1. **Install Composer** (if not installed):
```bash
# Windows (with Chocolatey)
choco install composer -y

# Or download from https://getcomposer.org/download/
```

2. **Install Dependencies**:
```bash
cd kanban-api
composer install
```

3. **Environment Setup**:
```bash
cp .env.example .env
php artisan key:generate
```

4. **Database Setup**:
```bash
# Create SQLite database file
touch database/database.sqlite

# Run migrations
php artisan migrate
```

5. **Start Server**:
```bash
php artisan serve --port=8000
```

API will be available at: `http://localhost:8000/api/v1`

## Quick Test

```bash
# List boards
curl http://localhost:8000/api/v1/boards

# Create board
curl -X POST http://localhost:8000/api/v1/boards \
  -H "Content-Type: application/json" \
  -d '{"name":"My First Board","description":"Project board","color":"#0066ff"}'

# Create list
curl -X POST http://localhost:8000/api/v1/boards/1/lists \
  -H "Content-Type: application/json" \
  -d '{"name":"To Do","position":0}'

# Create card
curl -X POST http://localhost:8000/api/v1/boards/1/lists/1/cards \
  -H "Content-Type: application/json" \
  -d '{"title":"First Task","description":"Test card","position":0}'
```

## Database Schema

### boards
- id (primary key)
- name (string)
- description (text, nullable)
- color (string, default: #0066ff)
- timestamps

### lists
- id (primary key)
- board_id (foreign key)
- name (string)
- position (integer, default: 0)
- timestamps

### cards
- id (primary key)
- list_id (foreign key)
- title (string)
- description (text, nullable)
- position (integer, default: 0)
- due_date (datetime, nullable)
- timestamps

### tags
- id (primary key)
- name (string, unique)
- color (string, default: #808080)
- timestamps

### members
- id (primary key)
- name (string)
- email (string, unique)
- avatar (string, nullable)
- timestamps

### card_tag (pivot)
- card_id (foreign key)
- tag_id (foreign key)

### card_member (pivot)
- card_id (foreign key)
- member_id (foreign key)

## Development Notes

- CORS enabled for `http://localhost:5173` (Vite default port)
- All API responses return JSON
- Error handling with proper HTTP status codes
- SQLite database stored at `database/database.sqlite`

## License

MIT
