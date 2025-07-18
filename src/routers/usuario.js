import express from 'express';
import UsuariosController from '../controllers/usuario.js';

const router = express.Router();

// Rutas de usuario
// Ruta para limpiar usuarios (solo para desarrollo)
router.delete('/clear', UsuariosController.clear);

router.post('/', UsuariosController.create);
router.get('/', UsuariosController.readAll);
router.get('/verify/:token', UsuariosController.verifyEmail);
router.post('/login', UsuariosController.login);
router.get('/:id', UsuariosController.readOne);
router.put('/:id', UsuariosController.update);
router.delete('/:id', UsuariosController.delete);

export default router;
