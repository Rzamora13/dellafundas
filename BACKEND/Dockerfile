# Imagen base oficial de PHP con FPM
FROM php:8.2-fpm

# Instalar extensiones necesarias para Symfony y MySQL
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    curl \
    libicu-dev \
    libpq-dev \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    libjpeg-dev \
    libpng-dev \
    libfreetype6-dev \
    libxslt-dev \
    && docker-php-ext-install intl pdo pdo_mysql zip opcache xsl

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Crear directorio de trabajo
WORKDIR /var/www/html

# Copiar los archivos del backend
COPY . .

# Instalar dependencias
RUN composer install --no-interaction --no-progress

# Permisos (opcional según sistema)
RUN chown -R www-data:www-data /var/www/html/var

CMD ["php-fpm"]
