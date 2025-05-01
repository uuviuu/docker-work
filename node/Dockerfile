FROM node:20

RUN apt-get update && apt-get install -y \
        curl \
        git \
        fish \
        nano \
        mc \
        zsh

RUN chsh -s /usr/bin/fish

COPY --from=spiralscout/roadrunner:2.9.1 /usr/bin/rr /usr/bin/rr

RUN export DOCKER_SCAN_SUGGEST=false

RUN npm install -g laravel-echo-server --verbose

USER node

# Если проект один, можно указать папку проекта
WORKDIR /var/www/smart-plan

EXPOSE 3000
EXPOSE 8080
EXPOSE 8000

CMD ["node"]