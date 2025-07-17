import Usuario from '../models/Usuario.js';
import crypto from 'crypto';
import { sendVerificationEmail } from '../utils/sendEmail.js';

class UsuariosController {
  
  // Crear usuario y enviar email de verificación
  static async create(req, res) {
    try {
      const { email, nombre, password } = req.body;

      // Generar token único
      const token = crypto.randomBytes(20).toString('hex');

      // Crear usuario con token y no verificado
      const nuevoUsuario = new Usuario({
        email,
        nombre,
        password,   // Recuerda hashear la contraseña antes de guardar
        verificationToken: token,
        isVerified: false,
      });

      await nuevoUsuario.save();

      // Enviar correo de verificación
      await sendVerificationEmail(email, token);

      res.status(201).json({ msg: "Usuario creado, revisa tu correo para verificar tu cuenta" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error al crear usuario" });
    }
  }

  // Verificar email
  static async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      const usuario = await Usuario.findOne({ verificationToken: token });

      if (!usuario) {
        return res.status(400).send("Token inválido o usuario no encontrado");
      }

      usuario.isVerified = true;
      usuario.verificationToken = undefined; // o null
      await usuario.save();

      res.send("Usuario verificado correctamente. Ya puedes iniciar sesión.");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error en la verificación");
    }
  }

  // Aquí puedes tener el resto de métodos como login, readAll, etc.
}

export default UsuariosController;




