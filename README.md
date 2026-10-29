## Фронтенд

- Node 22.12.0
- Npm 10

### Установка в репозитории проекта

- Локальная сборка проекта:
  ```
  npm install
  npm run build
  ```
- Режим отладки:
  ```
  npm run dev
  ```

## Бэкенд

- PHP 8.5.12
- Golang 1.25
- Mariadb 11
- Postgres 17
- Redis 8
- Meilisearch
- Mailhog

### Обновление PHP

Образ закреплён на `php:8.5.12-fpm`: этот выпуск исправляет критические
CVE-2026-109618 и CVE-2026-109619.
В `php/php.ini` отключён `session.upload_progress.enabled` по рекомендации
PHP от 23 октября 2026 года (CVE-2026-115560); настройку нужно сохранять
до выхода и установки исправления.

Официальные уведомления: https://www.php.net/archive/2026.php

Пересборка контейнера:
```
docker compose build --pull php
docker compose up -d --no-deps --force-recreate php
docker compose exec php php -v
docker compose exec php php -r 'echo "session.upload_progress.enabled=", ini_get("session.upload_progress.enabled"), PHP_EOL;'
docker compose exec php php-fpm -t
```

### Установка в репозитории проекта

- Локальная сборка проекта:
  ```
  composer install
  php artisan key:generate
  php artisan jwt:secret
  php artisan migrate
  ```
  ```
  php artisan storage:link
  chmod -R 775 storage
  chmod -R 775 public/storage
  ```
  
- Основные команды для работы с докером:
  ```
  docker-compose up -d
  docker-compose exec <имя контейнера> fish
  
  docker-compose up -d --build --force-recreate <имя контейнера> - для пересборки контейнера
  docker ps - показать запущенные контейнеры
  docker stop $(docker ps -aq) - остановить все
  docker system prune -a - удалить все неиспользуемые образы и контейнеры
  ```