FROM php:8.4-fpm

RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    unzip \
    zip \
    libxml2-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libonig-dev \
    libpng-dev \
    libwebp-dev \
    libicu-dev \
    libpq-dev \
    libxpm-dev \
    libvpx-dev \
    libzip-dev \
    libyaml-dev \
    fish \
    vim \
    mariadb-client \
    net-tools \
    ghostscript \
    libxrender1 \
    libxext6 \
    libfontconfig1 \
    pgloader \
    && rm -rf /var/lib/apt/lists/*

RUN pecl install yaml xdebug \
    && docker-php-ext-enable yaml xdebug

RUN docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
        --with-webp \
    && docker-php-ext-install -j$(nproc) \
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

ENV HOME=/home/php

RUN chsh -s /usr/bin/fish

COPY --from=spiralscout/roadrunner:2.9.1 /usr/bin/rr /usr/bin/rr
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

ADD php.ini /usr/local/etc/php/conf.d/40-custom.ini

COPY wkhtmltopdf /usr/bin/wkhtmltopdf
RUN chmod +x /usr/bin/wkhtmltopdf

RUN groupadd --gid 1000 php \
    && useradd --uid 1000 --gid 1000 --shell /usr/bin/fish -m php \
    && mkdir -p /home/php/.config /home/php/.cache \
    && chown -R php:php /home/php

USER php

WORKDIR /var/www/smart-plan

CMD ["fish"]