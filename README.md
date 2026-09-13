# Sistema de Gestión de Comercio Electrónico (Monorepo)

## Información Institucional
* **Institución:** Instituto Sanmiguelense
* **Asignatura:** Páginas Web II
* **Cátedra:** Profra. Lizeth Abril González Vázquez
* **Año:** 2026

---

## Descripción del Proyecto
Aplicación web desarrollada sobre una arquitectura monorepo. Integra un backend construido con NestJS y TypeORM para la persistencia en PostgreSQL, junto a un frontend desarrollado en Angular.

## Estrategia Arquitectónica
* **Backend:** REST API modular con autenticación JWT, guards por roles, validación con DTOs y almacenamiento relacional.
* **Frontend:** SPA reactiva con manejo de estado, interceptores HTTP, componentes modulares y protección de rutas.

USUARIO Y CONTRAEÑA DE PRUEBA, se pueden generar y registrar mas 
ymariaisabel647@gmail.com
369369
Maria Isabel Yañez Ramirez 

instrucciones para ejecutar correctamente el proyecto 

# 🌵 Tequilería Chavelita - Sistema de Gestión

Este proyecto consta de un Frontend desarrollado en **Angular** y un Backend desarrollado en **NestJS**.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu equipo:
- [Node.js](https://nodejs.org/) (Versión 18 o superior)
- [npm](https://www.npmjs.com/) (Viene incluido con Node.js)
- Tu gestor de base de datos (PostgreSQL / MySQL según aplique).

---

## 🚀 Guía de Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone <URL_DE_TU_REPOSITORIO_EN_GITHUB>
cd sistema-gestion-app

2. Configurar la Base de Datos 🛢️
Crea una base de datos local llamada tequileria_db (o el nombre configurado en el backend).

Importa el archivo backend/tequileria_db.sql utilizando tu cliente de base de datos o consola SQL.

Revisa o crea el archivo .env en la carpeta backend/ si requiere credenciales de conexión:

PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=tequileria_db

Ejecutar el Backend (NestJS) ⚙️
Abre una terminal y ejecuta los siguientes comandos:

cd backend
npm install
npm run start:dev

El servidor backend iniciará en http://localhost:3000

Ejecutar el Frontend (Angular) 💻
Abre otra terminal diferente y ejecuta los siguientes comandos:

Bash

cd frontend
npm install
npx ng serve

La aplicación web se abrirá en http://localhost:4200

Funcionalidades Principales
Inicio con bienvenida personalizada.

Catálogo interactivo de tequilas con filtro automático de productos.

Modal para consultar el detalle de stock y precio de cada producto.

importante clonar el repositorio, ejecutar npm install en ambas carpetas e importar la base de datos


para MAC OS

🍎 Instrucciones para macOS
1. Requisitos previos en Mac
Abrir la Terminal de macOS (Cmd + Espacio, escribir Terminal y presionar Enter).

Verificar que tenga instalados Node.js y npm ejecutando:

node -v
npm -v


Clonar y configurar la Base de Datos
Clonar el repositorio:
git clone https://github.com/Isayanez/Extra-paginas.git
cd Extra-paginas

Si usa PostgreSQL vía Terminal o App (como Postico o pgAdmin), importar el script SQL:

psql -U postgres -d tequileria_db -f backend/tequileria_db.sql

Ejecutar Backend y Frontend
Terminal 1 (Backend - NestJS):


cd backend
npm install
npm run start:dev

Terminal 2 (Frontend - Angular):

cd frontend
npm install
npx ng serve

📌 Notas útiles para macOS:
Si en Mac la terminal le da algún error de permisos al instalar paquetes, puede usar sudo npm install o ajustar los permisos de la carpeta del proyecto con chmod -R 755 ..

Al ejecutar npx ng serve, Angular abrirá la aplicación en http://localhost:4200 en Safari, Chrome o cualquier navegador predeterminado de macOS.

