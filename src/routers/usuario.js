import express from 'express';
import UsuariosController from '../controllers/usuario.js';

const router = express.Router();

// Rutas públicas
router.post('/login', UsuariosController.login);
router.post('/', UsuariosController.create);
router.get('/verify/:token', UsuariosController.verifyEmail);

// Ruta de limpieza (solo para desarrollo)
if (process.env.NODE_ENV !== 'production') {
  router.delete('/clear', UsuariosController.clear);
}

// Rutas protegidas
router.get('/', UsuariosController.readAll);
router.get('/:id', UsuariosController.readOne);
router.put('/:id', UsuariosController.update);
router.delete('/:id', UsuariosController.delete);

export default router;
