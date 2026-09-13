Café Soled - Backend API

Backend del proyecto Café Soled, desarrollado con NestJS, TypeORM y MariaDB.

El sistema incluye autenticación con JWT, contraseñas protegidas con bcrypt, roles de usuario, validación de datos con DTOs, paginación, manejo de errores y módulos de dominio para productos, clientes y pedidos.

Tecnologías utilizadas

Node.js

NestJS 11

TypeScript

TypeORM

MariaDB

Passport JWT

bcrypt

class-validator

class-transformer

Requisitos previos

Antes de ejecutar el proyecto debes tener instalado Node.js, npm, MariaDB o Docker y Git. Postman es opcional para probar la API.

Instalación


cd Proyecto_Abril_Base_Datos

2. Instalar dependencias

npm install

3. Crear el archivo .env

En Windows:

copy .env.template .env

En Linux/macOS:

cp .env.template .env

Después modifica los valores de acuerdo con tu instalación local.

Variables de entorno

Ejemplo:

PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=soled_cafe
DB_USERNAME=root
DB_PASSWORD=TU_PASSWORD
JWT_SECRET=CAMBIA_ESTA_CLAVE_POR_UNA_SEGURA

Significado:

Variable

Descripción

PORT

Puerto donde se ejecuta NestJS

DB_HOST

Servidor de MariaDB

DB_PORT

Puerto de MariaDB

DB_NAME

Nombre de la base de datos

DB_USERNAME

Usuario de conexión

DB_PASSWORD

Contraseña de MariaDB

JWT_SECRET

Clave para firmar los JWT

No subas tu archivo .env real al repositorio.

Base de datos

La base de datos utilizada es:

soled_cafe

NestJS se conecta a MariaDB mediante TypeORM.

Controller
    ↓
Service
    ↓
Repository de TypeORM
    ↓
Entity
    ↓
MariaDB

Ejecutar el proyecto

Modo desarrollo:

npm run start:dev

La API queda disponible en:

http://localhost:3000/api

Compilar:

npm run build

Producción:

npm run start:prod

Documentación básica de la API

URL base:

http://localhost:3000/api

Autenticación

Registrar usuario

POST /api/auth/register

Ejemplo de body:

{
  "email": "usuario@correo.com",
  "password": "Password123",
  "fullName": "Nombre del usuario",
  "empleado_id": 1
}

El empleado_id debe corresponder a un empleado válido y disponible en la base de datos.

Iniciar sesión

POST /api/auth/login

{
  "email": "usuario@correo.com",
  "password": "Password123"
}

Si las credenciales son correctas, el backend devuelve el usuario y un token JWT.

Comprobar sesión

GET /api/auth/check-status

Requiere:

Authorization: Bearer TU_TOKEN

Comprobar acceso de administrador

GET /api/auth/admin-check

Requiere JWT válido y rol admin.

Ejemplo:

@Auth('admin')

Productos

Listar

GET /api/products?limit=10&offset=0

Obtener uno

GET /api/products/:id

Crear

POST /api/products

Actualizar

PATCH /api/products/:id

Eliminar

DELETE /api/products/:id

Clientes

GET    /api/clients?limit=10&offset=0
GET    /api/clients/:id
POST   /api/clients
PATCH  /api/clients/:id
DELETE /api/clients/:id

Pedidos

GET    /api/orders?limit=10&offset=0
GET    /api/orders/:id
POST   /api/orders
PATCH  /api/orders/:id
DELETE /api/orders/:id

Seed

GET /api/seed

Sirve para cargar datos iniciales o de prueba.

Validación

El ValidationPipe global está en:

src/main.ts

Configuración principal:

whitelist: true
forbidNonWhitelisted: true
transform: true

Los DTOs están dentro de:

src/*/dto/

Seguridad

bcrypt

Las contraseñas no se guardan en texto plano.

contraseña → bcrypt → hash → MariaDB

JWT

Después de iniciar sesión se genera un token JWT que se envía en:

Authorization: Bearer TU_TOKEN

Roles

La aplicación maneja:

admin
user

Guards y @Auth()

Los Guards controlan si una petición puede continuar.

@Auth()

protege una ruta autenticada.

@Auth('admin')

requiere autenticación y rol admin.

Estructura principal

src/
├── auth/
├── common/
├── products/
├── clients/
├── orders/
├── seed/
├── app.module.ts
└── main.ts

Resumen de arquitectura

Angular / Postman
      ↓
Controller
      ↓
Service
      ↓
Repository
      ↓
TypeORM
      ↓
MariaDB

Para seguridad:

Login
  ↓
bcrypt
  ↓
JWT
  ↓
Guard
  ↓
Roles / @Auth()
  ↓
Ruta protegida

