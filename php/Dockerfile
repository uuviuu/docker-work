FROM php:8.3-fpm

RUN apt update && apt install -y \
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
        redis \
        mariadb-client \
        net-tools \
        libqt5webkit5 \
        libqt5webkit5-dev \
    && pecl install yaml \
    && pecl install xdebug \
    && pecl install redis \
    && docker-php-ext-enable yaml\
    && docker-php-ext-enable xdebug \
    && docker-php-ext-enable redis

RUN set -eux; \
    docker-php-ext-install soap; \
    docker-php-ext-configure gd --enable-gd --with-freetype --with-jpeg --with-xpm --with-webp; \
    docker-php-ext-configure soap --enable-soap; \
    docker-php-ext-configure intl; \
    docker-php-ext-configure zip; \
    docker-php-ext-install -j "$(nproc)" iconv \
        mbstring \
        gd \
        intl \
        sockets \
        zip \
        pgsql \
        pdo_pgsql \
        mysqli \
        opcache \
        pdo_mysql \
        pcntl \
        exif

RUN chsh -s /usr/bin/fish

COPY --from=spiralscout/roadrunner:2.9.1 /usr/bin/rr /usr/bin/rr

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

ADD php.ini /usr/local/etc/php/conf.d/40-custom.ini

COPY wkhtmltopdf /usr/bin/wkhtmltopdf
RUN chmod +x /usr/bin/wkhtmltopdf

RUN groupadd --gid 1000 php \
    && useradd --uid 1000 --gid 1000 --shell /usr/bin/fish php \
    && mkdir /home/php \
    && chmod 777 /home/php

USER php

# Если проект один, можно указать папку проекта
WORKDIR /var/www/smart-plan

CMD ["php-fpm"]