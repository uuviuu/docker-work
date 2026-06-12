FROM node:22

RUN apt-get update && apt-get install -y \
    curl \
    git \
    fish \
    nano \
    mc \
    zsh \
    && rm -rf /var/lib/apt/lists/*

RUN chsh -s /usr/bin/fish

COPY --from=spiralscout/roadrunner:2.9.1 /usr/bin/rr /usr/bin/rr

RUN export DOCKER_SCAN_SUGGEST=false

RUN npm install -g \
    newman

USER node

WORKDIR /var/www/smart-plan

EXPOSE 3000
EXPOSE 8000
EXPOSE 6001
EXPOSE 6006
EXPOSE 5173

CMD ["node"]