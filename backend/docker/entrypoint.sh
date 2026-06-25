#!/bin/sh
set -e

# ── Ensure SQLite database file exists ────────────────────────────────
DB_PATH="${DB_DATABASE:-/var/www/html/database/database.sqlite}"
mkdir -p "$(dirname "$DB_PATH")"
touch "$DB_PATH"
chown www-data:www-data "$DB_PATH" 2>/dev/null || true

# ── Laravel bootstrap ─────────────────────────────────────────────────
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force

# ── Start nginx + php-fpm ─────────────────────────────────────────────
php-fpm -D
nginx -g "daemon off;"
