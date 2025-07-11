import { Router } from "express";
import UsuariosCrontoller from '../controllers/usuario.js';

const usuariosRouter = Router();

usuariosRouter.post('/', UsuariosCrontoller.create);
usuariosRouter.get('/', UsuariosCrontoller.readAll);
usuariosRouter.get('/:id', UsuariosCrontoller.readOne);
usuariosRouter.put('/:id', UsuariosCrontoller.update);
usuariosRouter.delete('/:id', UsuariosCrontoller.delete);

export default usuariosRouter;