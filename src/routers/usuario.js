import { Router } from "express";
import UsuariosController from "../controllers/usuario.js";

const usuariosRouter = Router();

usuariosRouter.post("/", UsuariosController.create);           // Registro
usuariosRouter.post("/login", UsuariosController.login);       // Login
usuariosRouter.get("/", UsuariosController.readAll);           // Obtener todos los usuarios
usuariosRouter.get("/:id", UsuariosController.readOne);        // Obtener usuario por id
usuariosRouter.put("/:id", UsuariosController.update);         // Actualizar usuario
usuariosRouter.delete("/:id", UsuariosController.delete);      // Eliminar usuario
usuariosRouter.get("/verify/:token", UsuariosController.verifyEmail);  // Verificación email

export default usuariosRouter;


