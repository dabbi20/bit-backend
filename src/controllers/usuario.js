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
      const { name, email, password, cell = '' } = req.body;
      
      // Si viene name, lo dividimos en nombres y apellidos
      // Si no, usamos valores por defecto
      const [nombres, ...apellidosArray] = name ? name.split(' ') : ['Usuario', ''];
      const apellidos = apellidosArray.join(' ') || 'Sin apellido';

      const newUser = new UsuarioModel({
        nombres: nombres || 'Usuario',
        apellidos: apellidos || 'Sin apellido',
        email,
        cell,
        password,
        isVerified: true,
        estado: 'activo',
        rol: 'usuario'
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

      // Buscar el usuario por email
      const user = await UsuarioModel.findOne({ email });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Credenciales inválidas',
          data: null
        });
      }

      // Verificar la contraseña
      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Credenciales inválidas',
          data: null
        });
      }

      // Crear el token JWT
      const token = jwt.sign(
        { id: user._id, email: user.email, rol: user.rol },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      // Preparar la respuesta en el formato que espera el frontend
      const userResponse = {
        id: user._id,
        email: user.email,
        name: `${user.nombres} ${user.apellidos}`.trim(),
        token: token,
        roles: [user.rol],
        expiresIn: 86400 // 1 día en segundos
      };

      res.json(userResponse);
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
