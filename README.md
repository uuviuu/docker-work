## Фронтенд

### Стек

- Node 20

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

- PHP 8.3
- Mariadb latest

### Стек

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
  
- Основные команды работы с докером:
  ```
  docker-compose up -d
  docker-compose exec <имя контейнера> fish
  
  docker-compose up -d --build --force-recreate <имя контейнера> - для пересборки контейнера
  docker ps - показать запущенные контейнеры
  docker stop $(docker ps -aq) - остановить все
  docker system prune -a - удалить все неиспользуемые образы и контейнеры
  ```
