# Laravel API Setup Guide

## Prerequisites

You need **Composer** to install Laravel dependencies. Here's how to install it on Windows:

### Install Composer

**Option 1: Using Chocolatey** (Recommended)
```bash
choco install composer -y
```

**Option 2: Manual Download**
1. Download from: https://getcomposer.org/Composer-Setup.exe
2. Run the installer
3. Restart your terminal

**Option 3: Using Scoop**
```bash
scoop install composer
```

---

## Installation Steps

Once Composer is installed, follow these steps:

### 1. Install Dependencies
```bash
cd kanban-api
composer install
```

This will install Laravel 10 and all required packages (~50MB download).

### 2. Setup Environment
```bash
# Copy the environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 3. Create SQLite Database
```bash
# Create database directory if it doesn't exist
mkdir -p database

# Create empty SQLite database file
touch database/database.sqlite
```

On Windows (if `touch` doesn't work):
```bash
type nul > database/database.sqlite
```

### 4. Run Migrations
```bash
php artisan migrate
```

This creates all the tables:
- boards
- lists
- cards
- tags
- members
- card_tag (pivot)
- card_member (pivot)

### 5. Start the Server
```bash
php artisan serve --port=8000
```

The API will be available at: **http://localhost:8000/api/v1**

---

## Verify Installation

Test the API with curl:

```bash
# Check if server is running
curl http://localhost:8000

# List boards (should return empty array)
curl http://localhost:8000/api/v1/boards

# Create a test board
curl -X POST http://localhost:8000/api/v1/boards \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test Board\",\"description\":\"My first board\",\"color\":\"#0066ff\"}"
```

---

## Troubleshooting

### Composer not found
- Make sure you've installed Composer
- Restart your terminal after installation
- Run `composer --version` to verify

### SQLite errors
- Make sure the `database` directory exists
- Make sure `database.sqlite` file is created
- Check PHP has SQLite extension: `php -m | grep sqlite`

### Port already in use
If port 8000 is already taken, use a different port:
```bash
php artisan serve --port=8080
```

Then update the frontend's API URL to `http://localhost:8080/api/v1`

### Migration errors
If migrations fail, try:
```bash
php artisan migrate:fresh
```

---

## Project Structure

```
kanban-api/
├── app/
│   ├── Http/Controllers/Api/
│   │   ├── BoardController.php
│   │   ├── ListController.php
│   │   ├── CardController.php
│   │   ├── TagController.php
│   │   └── MemberController.php
│   └── Models/
│       ├── Board.php
│       ├── BoardList.php
│       ├── Card.php
│       ├── Tag.php
│       └── Member.php
├── database/
│   ├── migrations/
│   │   ├── 2024_01_01_000001_create_boards_table.php
│   │   ├── 2024_01_01_000002_create_lists_table.php
│   │   ├── 2024_01_01_000003_create_cards_table.php
│   │   ├── 2024_01_01_000004_create_tags_table.php
│   │   ├── 2024_01_01_000005_create_members_table.php
│   │   ├── 2024_01_01_000006_create_card_tag_table.php
│   │   └── 2024_01_01_000007_create_card_member_table.php
│   └── database.sqlite (created during setup)
├── routes/
│   ├── api.php (All API routes)
│   └── web.php
├── .env (created from .env.example)
├── composer.json
└── README.md
```

---

## Next Steps

Once the API is running:

1. Keep this terminal open (API server)
2. Open a new terminal
3. Navigate to the frontend directory
4. Start the React app (see frontend SETUP.md)
