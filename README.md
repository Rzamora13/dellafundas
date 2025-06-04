# DELLAFUNDAS - Sistema de Gestión de Fundas Personalizadas

## 1. Análisis del Problema

### 1.1. Introducción
DELLAFUNDAS es una plataforma web moderna diseñada para la gestión y venta de accesorios enfocados a la música. El sistema permite a los usuarios explorar, agregar al carrito y comprar, mientras que los administradores pueden gestionar el catálogo de productos, usuarios, pedidos y categorias de manera eficiente.

### 1.2. Objetivos
- Crear una plataforma e-commerce moderna y fácil de usar para la venta de accesorios
- Implementar un sistema de gestión de usuarios con diferentes roles (administrador y usuario)
- Desarrollar un catálogo de productos con filtros por categorías y artistas
- Establecer un sistema de carrito de compras y gestión de pedidos
- Proporcionar una interfaz administrativa para la gestión del negocio
- Implementar un sistema seguro de autenticación y autorización

### 1.3. Funciones y Rendimientos Deseados
- **Gestión de Usuarios**
  - Registro e inicio de sesión de usuarios
  - Perfiles de usuario personalizables
  - Sistema de roles (administrador y usuario)
  - Gestión de permisos basada en roles

- **Catálogo de Productos**
  - Visualización de productos con imágenes
  - Filtrado por categorías y artistas
  - Búsqueda de productos
  - Detalles completos de cada producto

- **Carrito de Compras**
  - Añadir/eliminar productos
  - Modificar cantidades
  - Cálculo automático de precios
  - Proceso de compra

- **Panel de Administración**
  - Gestión de productos (CRUD)
  - Gestión de categorías y artistas
  - Gestión de usuarios
  - Gestión de pedidos
  - Importación de productos mediante CSV

### 1.4. Planteamiento y Evaluación de Soluciones
Se evaluaron varias alternativas para la implementación:

1. **Arquitectura Monolítica vs Microservicios**
   - Se eligió una arquitectura monolítica por su simplicidad y facilidad de mantenimiento
   - La separación frontend/backend permite escalabilidad futura si es necesario

2. **Tecnologías Frontend**
   - React fue elegido por su robustez, gran ecosistema y rendimiento
   - Tailwind CSS para estilos por su flexibilidad y facilidad de mantenimiento

3. **Tecnologías Backend**
   - Symfony (PHP) seleccionado por su madurez, seguridad y características empresariales
   - MySQL como base de datos por su confiabilidad y amplio soporte

4. **Containerización**
   - Docker elegido para facilitar el despliegue y desarrollo
   - Docker Compose para orquestar los servicios

### 1.5. Justificación de la Solución Elegida
La solución implementada ofrece:
- Arquitectura moderna y mantenible
- Separación clara de responsabilidades
- Escalabilidad y rendimiento
- Seguridad robusta
- Facilidad de desarrollo y despliegue
- Costos de mantenimiento optimizados

### 1.6. Modelado de la Solución

#### 1.6.1. Recursos Humanos
- Desarrollador Full Stack
- Diseñador UI/UX
- Administrador de sistemas
- Soporte técnico

#### 1.6.2. Recursos Hardware
- Servidor de producción
  - CPU: 2+ núcleos
  - RAM: 4GB mínimo
  - Almacenamiento: 50GB SSD
- Entorno de desarrollo
  - Ordenador de desarrollo con Docker
  - Conexión a Internet estable

#### 1.6.3. Recursos Software
- **Frontend**
  - React 19.1.0  
  - Tailwind CSS para estilos rápidos y personalizables  
  - React Router para la navegación entre páginas  
  - Context API para manejar el estado de la aplicación  
  - fetch API para realizar peticiones HTTP  


- **Backend**
  - PHP 8.2.12
  - Symfony 7.2.6
  - MySQL 8.0
  - Nginx como servidor web

- **Herramientas de Desarrollo**
  - Docker y Docker Compose
  - Git para control de versiones
  - Node.js y npm
  - Composer (gestor de dependencias PHP)

### 1.7. Planificación Temporal
1. **Fase 1: Análisis y Diseño** (2 semanas)
   - Análisis de requisitos
   - Diseño de arquitectura
   - Diseño de base de datos

2. **Fase 2: Desarrollo Backend** (4 semanas)
   - Implementación de API REST
   - Sistema de autenticación
   - Gestión de productos y usuarios

3. **Fase 3: Desarrollo Frontend** (4 semanas)
   - Implementación de interfaces
   - Integración con backend
   - Implementación de funcionalidades

4. **Fase 4: Testing y Optimización** (1 semana)
   - Pruebas unitarias
   - Pruebas de integración
   - Optimización de rendimiento

5. **Fase 5: Despliegue y Documentación** (1 semana)
   - Configuración de producción
   - Documentación final
   - Lanzamiento

## 2. Diseño e Implementación del Proyecto

### 2.1. Arquitectura del Sistema
El sistema está dividido en dos partes principales:

#### Frontend (React)
- **Componentes Principales**
  - Layouts (RootLayout)
  - Páginas (Home, Products, Cart, etc.)
  - Componentes reutilizables
  - Contextos para gestión de estado

- **Características Implementadas**
  - Sistema de rutas protegidas
  - Gestión de estado con Context API
  - Diseño responsive con Tailwind CSS
  - Integración con API REST

#### Backend (Symfony)
- **Estructura**
  - API REST
  - Gestión de entidades
  - Controladores RESTful

### 2.2. Base de Datos
- **Entidades Principales**
  - Users
  - Products
  - Categories
  - Artists
  - Orders
  - CartProduct

## 3. Fase de Pruebas

### 3.1. Pruebas Unitarias
- Pruebas de componentes React
- Pruebas de servicios PHP
- Pruebas de modelos y entidades

### 3.2. Pruebas de Integración
- Pruebas de flujos completos
- Pruebas de API
- Pruebas de autenticación

### 3.3. Pruebas de Rendimiento
- Pruebas de carga
- Optimización de consultas
- Caché y optimizaciones

## 4. Documentación de la Aplicación

### 4.1. Introducción a la Aplicación
Para comenzar a usar DELLAFUNDAS:

1. Clonar el repositorio
2. Configurar variables de entorno
3. Ejecutar con Docker Compose

### 4.2. Manual de Instalación
```bash
# Clonar el repositorio
git clone [https://github.com/Rzamora13/dellafundas.git]

# ⚠️ Si tu configuración local (por ejemplo, MySQL o puertos) es distinta,
# editá el archivo .env para que coincida con tu entorno.

# Iniciar con Docker Compose
docker-compose up --build

# ⚠️ Si tu configuración local es distinta deberas cambiar los puertos,
# Accede a la aplicación desde el navegador
  - Frontend: http://localhost:5173/
  - Backend: http://localhost:8080/
  - Base de Datos: http://localhost:8081/
```

### 4.3. Manual de Usuario
- **Registro e Inicio de Sesión**
  - Crear cuenta
  - Iniciar sesión

- **Navegación**
  - Explorar productos
  - Filtrar por categorías
  - Filtrar por artistas

- **Compras**
  - Añadir al carrito
  - Gestionar carrito
  - Realizar pedido

### 4.4. Manual de Administración
- **Gestión de Productos**
  - Crear/editar/eliminar productos
  - Gestionar categorías
  - Gestionar artistas
  - Importar productos

- **Gestión de Usuarios**
  - Ver usuarios
  - Gestionar roles

- **Gestión de Pedidos**
  - Ver pedidos
  - Filtrar por estados
  - Busqueda por id
  - Actualizar estados para gestionar los envios

## 5. Conclusiones Finales

### 5.1. Grado de Cumplimiento
- ✅ Sistema de usuarios implementado
- ✅ Catálogo de productos funcional
- ✅ Carrito de compras operativo
- ✅ Panel de administración completo
- ✅ Sistema de autenticación

### 5.2. Propuestas de Mejora
- Implementación de sistema de pagos
- Integración con redes sociales
- Sistema de reseñas y valoraciones
- Sistema de soporte y tickets
- Personalización de productos
- Sección de novedades y notificaciones

## 6. Bibliografía
- [Documentación de MDN Web Docs](https://developer.mozilla.org)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs/installation/using-vite)
- [Documentación de Toastify](https://www.npmjs.com/package/react-toastify)
- Asesorías y ayuda de IA
