# ── Stage 1: build dependencies ───────────────────────────────────────
FROM composer:2.7 AS vendor

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --prefer-dist \
    --ignore-platform-reqs

COPY . .
RUN composer dump-autoload --optimize --no-dev

# ── Stage 2: production image ─────────────────────────────────────────
FROM php:8.3-fpm-alpine

# Install system deps + PHP extensions needed by Laravel + SQLite
RUN apk add --no-cache \
    nginx \
    sqlite \
    sqlite-libs \
    sqlite-dev \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip \
    curl \
    && docker-php-ext-install \
        pdo \
        pdo_sqlite \
        sqlite3 \
        mbstring \
        bcmath \
        opcache \
        xml

# Copy nginx config
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Set working directory
WORKDIR /var/www/html

# Copy app from build stage
COPY --from=vendor /app /var/www/html

# Copy entrypoint
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Storage permissions
RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

# SQLite database directory — will be overridden by a Render disk mount
RUN mkdir -p /var/data && chown www-data:www-data /var/data

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
