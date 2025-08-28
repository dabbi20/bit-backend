# Bit-Backend - Sistema de Administración

Este proyecto es una API REST construida con Node.js, Express y MongoDB que incluye:

- **Autenticación de usuarios** con JWT
- **Sistema de roles** (usuario y administrador)
- **CRUD completo de productos** con manejo de imágenes
- **Verificación por correo electrónico**
- **Operaciones CRUD** para usuarios y productos

---

## Tecnologías

- Node.js
- Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Bcrypt (para encriptar contraseñas)
- Multer (para manejo de archivos)
- Nodemailer (para envío de correos)
- Dotenv (variables de entorno)
- Morgan (logging)
- CORS (para peticiones cruzadas)

## Configuración Inicial

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` basado en `.env.example` y configura las variables de entorno
4. Inicia la base de datos MongoDB
5. Crea un usuario administrador:
   ```bash
   npm run create-admin
   ```
6. Inicia el servidor en desarrollo:
   ```bash
   npm run dev
   ```
   O en producción:
   ```bash
   npm start
   ```

## API Endpoints

### Autenticación
- `POST /api/usuarios/register` - Registrar un nuevo usuario
- `POST /api/usuarios/login` - Iniciar sesión
- `GET /api/usuarios/verify-email/:token` - Verificar correo electrónico

### Usuarios (requiere autenticación)
- `GET /api/usuarios` - Obtener todos los usuarios (solo admin)
- `GET /api/usuarios/:id` - Obtener un usuario por ID
- `PUT /api/usuarios/:id` - Actualizar un usuario
- `DELETE /api/usuarios/:id` - Eliminar un usuario (solo admin)

### Productos
- `GET /api/productos` - Obtener todos los productos (público)
- `GET /api/productos/:id` - Obtener un producto por ID (público)
- `POST /api/productos` - Crear un nuevo producto (solo admin)
- `PUT /api/productos/:id` - Actualizar un producto (solo admin)
- `DELETE /api/productos/:id` - Eliminar un producto (solo admin)
- `DELETE /api/productos/:productoId/image/:imageName` - Eliminar una imagen de un producto (solo admin)

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
MONGODB_URI=mongodb://localhost:27017/bit-backend
JWT_SECRET=tu_clave_secreta_jwt
FRONTEND_URL=http://localhost:4200
EMAIL_SERVICE=servicio_de_correo
EMAIL_USER=tu_correo@ejemplo.com
EMAIL_PASS=tu_contraseña
```

## Crear Usuario Administrador

Para crear un usuario administrador, ejecuta:

```bash
npm run create-admin
```

Esto creará un usuario administrador con las siguientes credenciales por defecto:
- Email: admin@example.com
- Contraseña: Admin123!

**Importante:** Cambia la contraseña después del primer inicio de sesión.

## Manejo de Imágenes

Las imágenes de los productos se guardan en el directorio `uploads/` en la raíz del proyecto. Asegúrate de que este directorio tenga permisos de escritura.

## Seguridad

- Todas las rutas de administración requieren autenticación y rol de administrador
- Las contraseñas se almacenan con hash usando bcrypt
- Se utilizan tokens JWT para la autenticación
- Se recomienda usar HTTPS en producción

---

##  Estructura de Carpetas

```
bit-backend/
├── node_modules/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── usuario.js
│   │   └── producto.js
│   ├── middlewares/
│   │   └── authJwt.js
│   ├── models/
│   │   ├── UsuarioModel.js
│   │   └── ProductoModel.js
│   ├── routers/
│   │   ├── usuario.js
│   │   └── producto.js
│   ├── utils/
│   │   ├── sendEmail.js
│   │   └── scripts/
│   │       └── createAdmin.js
│   └── server.js
├── uploads/
│   └── (imágenes de productos)
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md


