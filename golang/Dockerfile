FROM golang:1.24

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


RUN groupadd --gid 1000 golang \
    && useradd --uid 1000 --gid 1000 --shell /usr/bin/fish -m golang \
    && mkdir -p /home/golang/.config /home/golang/.cache \
    && chown -R golang:golang /home/golang

USER golang

WORKDIR /var/www

CMD ["fish"]