# Bit-Backend - API de Usuarios con Verificación por Email

Este proyecto es una API REST construida con Node.js, Express y MongoDB para la gestión de usuarios. Incluye funcionalidades como registro de usuario, verificación de correo electrónico, login con JWT, y operaciones CRUD.

---

## Tecnologías

- Node.js
- Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Bcrypt (para encriptar contraseñas)
- Nodemailer (para envío de correos)
- Dotenv (variables de entorno)
- Morgan

---

##  Estructura de Carpetas

bit-backend/
├── node_modules/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── usuario.js
│   ├── models/
│   │   └── usuario.js
│   ├── routers/
│   │   └── usuario.js
│   ├── utils/
│   │   └── sendEmail.js
│   └── server.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md







