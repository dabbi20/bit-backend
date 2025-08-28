import 'dotenv/config';
import connectDB from './config/db.js';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import errorHandler from './middlewares/errorHandler.js';
import { AppError } from './middlewares/errorHandler.js';

// Routers
import usuariosRouter from './routers/usuario.js';
import productosRouter from './routers/producto.js';

// Configuración para manejar __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Conectar a la base de datos
connectDB();

// Middlewares
if (!isProduction) {
  server.use(morgan('dev'));
}

// Body parser
server.use(express.json({ limit: '10kb' }));
server.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Configuración de CORS forzada
server.use((req, res, next) => {
  // Lista de orígenes permitidos
  const allowedOrigins = [
    'http://localhost:4200',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:55766',
    process.env.FRONTEND_URL
  ].filter(Boolean);

  const origin = req.headers.origin;
  
  // Si el origen está en la lista de permitidos o estamos en desarrollo
  if (allowedOrigins.includes(origin) || !isProduction) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  
  // Configuración de cabeceras CORS
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-Auth-Token');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Responder a las peticiones OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Archivos estáticos
const uploadsPath = path.join(__dirname, '../../uploads');
server.use('/uploads', express.static(uploadsPath));

// Ruta de prueba
server.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version
  });
});

// Rutas de la API
server.use('/api/usuarios', usuariosRouter);
server.use('/api/productos', productosRouter);

// Ruta para manejar rutas no encontradas
server.all('*', (req, res, next) => {
  next(new AppError(`No se pudo encontrar ${req.originalUrl} en este servidor`, 404));
});

// Manejador de errores global
server.use(errorHandler);

// Iniciar servidor
const serverInstance = server.listen(port, () => {
  console.log(`✅ Servidor corriendo en el puerto ${port}`);
  console.log(`🌐 Modo: ${isProduction ? 'PRODUCCIÓN' : 'DESARROLLO'}`);
  console.log('🌍 Orígenes permitidos: http://localhost:4200, http://localhost:3000, http://localhost:5173');
  console.log(`📂 Directorio de uploads: ${uploadsPath}`);
});

// Manejadores de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Apagando...');
  console.error(err.name, err.message);
  serverInstance.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECIBIDO. Apagando con gracia');
  serverInstance.close(() => {
    console.log('💥 Proceso terminado');
  });
});
