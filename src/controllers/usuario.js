import UsuarioModel from "../models/UsuarioModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/sendEmail.js";

const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta";

const UsuariosController = {
  // Ruta para limpiar todos los usuarios (solo para desarrollo)
  clear: async (req, res) => {
    try {
      await UsuarioModel.deleteMany({});
      res.status(200).json({
        allOK: true,
        message: "Todos los usuarios han sido eliminados.",
        data: null
      });
    } catch (error) {
      console.error('Error en clear:', error);
      res.status(500).json({
        allOK: false,
        message: error.message || "Error eliminando usuarios",
        data: null
      });
    }
  },

  create: async (req, res) => {
    try {
      const { nombres, apellidos, email, cell, password } = req.body;

      const newUser = new UsuarioModel({
        nombres,
        apellidos,
        email,
        cell,
        password,  // solo pasamos el password plano
        isVerified: true,  // El usuario se registra como verificado
        estado: 'activo'  // El usuario está activo inmediatamente
      });

      await newUser.save(); // aquí se hashea el password con el pre save del modelo

      // No necesitamos enviar correo ni token de verificación
      console.log('Usuario creado:', {
        email,
        estado: 'registrado'
      });

      res.status(201).json({
        allOK: true,
        message: "Usuario registrado exitosamente. Ya puedes iniciar sesión.",
        data: null,
      });
    } catch (error) {
      console.error('Error en create:', error);
      res.status(500).json({
        allOK: false,
        message: error.message || "Error registrando usuario",
        data: null,
      });
    }
  },

  readAll: async (req, res) => {
    try {
      const usuarios = await UsuarioModel.find();
      res.status(200).json({
        allOK: true,
        message: "Usuarios encontrados",
        data: usuarios,
      });
    } catch (error) {
      console.error('Error en readAll:', error);
      res.status(500).json({
        allOK: false,
        message: error.message || "Error obteniendo usuarios",
        data: null,
      });
    }
  },

  readOne: async (req, res) => {
    try {
      const usuario = await UsuarioModel.findById(req.params.id);
      if (!usuario) {
        return res.status(404).json({
          allOK: false,
          message: "Usuario no encontrado",
          data: null,
        });
      }
      res.status(200).json({
        allOK: true,
        message: "Usuario encontrado",
        data: usuario,
      });
    } catch (error) {
      console.error('Error en readOne:', error);
      res.status(500).json({
        allOK: false,
        message: error.message || "Error obteniendo usuario",
        data: null,
      });
    }
  },

  update: async (req, res) => {
    try {
      const usuario = await UsuarioModel.findById(req.params.id);
      if (!usuario) {
        return res.status(404).json({
          allOK: false,
          message: "Usuario no encontrado",
          data: null,
        });
      }

      const { nombres, apellidos, email, cell, password } = req.body;

      if (nombres) usuario.nombres = nombres;
      if (apellidos) usuario.apellidos = apellidos;
      if (email) usuario.email = email;
      if (cell) usuario.cell = cell;
      if (password) {
        usuario.password = password; // será hasheado por el pre save
      }

      await usuario.save();

      res.status(200).json({
        allOK: true,
        message: "Usuario actualizado",
        data: usuario,
      });
    } catch (error) {
      console.error('Error en update:', error);
      res.status(500).json({
        allOK: false,
        message: error.message || "Error actualizando usuario",
        data: null,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const usuario = await UsuarioModel.findByIdAndDelete(req.params.id);
      if (!usuario) {
        return res.status(404).json({
          allOK: false,
          message: "Usuario no encontrado",
          data: null,
        });
      }
      res.status(200).json({
        allOK: true,
        message: "Usuario eliminado",
        data: usuario,
      });
    } catch (error) {
      console.error('Error en delete:', error);
      res.status(500).json({
        allOK: false,
        message: error.message || "Error eliminando usuario",
        data: null,
      });
    }
  },

  verifyEmail: async (req, res) => {
    try {
      const { token } = req.params;
      const usuario = await UsuarioModel.findOne({ emailToken: token });

      if (!usuario) {
        return res.status(400).json({
          allOK: false,
          message: "Token inválido o usuario no encontrado",
          data: null,
        });
      }

      usuario.isVerified = true;
      usuario.emailToken = undefined;
      await usuario.save();

      res.status(200).json({
        allOK: true,
        message: "Email verificado correctamente",
        data: null,
      });
    } catch (error) {
      console.error('Error en verifyEmail:', error);
      res.status(500).json({
        allOK: false,
        message: error.message || "Error verificando email",
        data: null,
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const usuario = await UsuarioModel.findOne({ email });

      if (!usuario) {
        return res.status(401).json({
          allOK: false,
          message: "Usuario no encontrado",
          data: null,
        });
      }

      const isMatch = await usuario.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          allOK: false,
          message: "Contraseña incorrecta",
          data: null,
        });
      }

      if (!usuario.isVerified) {
        return res.status(401).json({
          allOK: false,
          message: "Cuenta no verificada. Por favor verifica tu correo",
          data: null,
        });
      }

      const token = jwt.sign(
        { id: usuario._id },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(200).json({
        allOK: true,
        message: "Login exitoso",
        data: {
          token,
          usuario: {
            id: usuario._id,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            email: usuario.email,
            cell: usuario.cell,
            rol: usuario.rol,
            estado: usuario.estado
          }
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        allOK: false,
        message: error.message || "Error al iniciar sesión",
        data: null,
      });
    }
  }
};

export default UsuariosController;
