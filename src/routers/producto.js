import { Router } from 'express';
import ProductoController from '../controllers/producto.js';
import { verifyToken, isAdmin } from '../middlewares/authJwt.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Configuración de Multer para manejar la subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5
  }
});

// Rutas públicas
router.get('/', ProductoController.getAll);
router.get('/:id', ProductoController.getById);

// Middleware para verificar autenticación y permisos
const requireAuth = [verifyToken, isAdmin];

// Rutas protegidas
router.post('/', requireAuth, upload.array('imagenes', 5), ProductoController.create);
router.put('/:id', requireAuth, upload.array('nuevasImagenes', 5), ProductoController.update);
router.delete('/:id', requireAuth, ProductoController.delete);
router.delete('/:productoId/images/:imageName', requireAuth, ProductoController.deleteImage);

export default router;
