## Фронтенд

- Node 22
- Npm 10.9.7

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

- PHP 8.4
- Mariadb latest

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

### Переезд на postgres (вне докера)
```
sudo apt update
sudo apt install pgloader
pgloader --version

Дальше в postgres создается схема по названию бд в mariadb
В .env меняется подключение на postgres
php artisan migrate
pgloader --debug migrate.load
```