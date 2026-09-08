FROM php:8.5-fpm

RUN apt-get update && apt-get install -y --no-install-recommends \
        curl \
        wget \
        git \
        unzip \
        zip \
        fish \
        vim \
        mariadb-client \
        net-tools \
        ghostscript \
    && rm -rf /var/lib/apt/lists/*

ADD --chmod=0755 https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

RUN install-php-extensions \
        yaml \
        xdebug \
        mbstring \
        bcmath \
        gd \
        intl \
        sockets \
        zip \
        pgsql \
        pdo_pgsql \
        mysqli \
        pdo_mysql \
        pcntl \
        exif \
        opcache \
        soap

COPY --from=ghcr.io/roadrunner-server/roadrunner:2025.1 /usr/bin/rr /usr/bin/rr
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY php.ini /usr/local/etc/php/conf.d/40-custom.ini

ENV HOME=/home/php

RUN groupadd --gid 1000 php \
    && useradd --uid 1000 --gid 1000 --shell /usr/bin/fish -m php \
    && mkdir -p /home/php/.config /home/php/.cache \
    && chown -R php:php /home/php \
    && chsh -s /usr/bin/fish php

USER php
WORKDIR /var/www

CMD ["php-fpm"]