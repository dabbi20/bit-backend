import UsuarioModel from "../models/usuario.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/sendEmail.js";

const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta";

const UsuariosController = {
  create: async (req, res) => {
    try {
      const { nombres, apellidos, email, cell, password } = req.body;
      const emailToken = crypto.randomBytes(32).toString("hex");

      const newUser = new UsuarioModel({
        nombres,
        apellidos,
        email,
        cell,
        password,  // solo pasamos el password plano
        emailToken,
      });

      await newUser.save(); // aquí se hashea el password con el pre save del modelo

      await sendVerificationEmail(email, emailToken);

      res.status(201).json({
        allOK: true,
        message: "Usuario registrado. Revisa tu email para verificar tu cuenta.",
        data: null,
      });
    } catch (error) {
      res.status(500).json({
        allOK: false,
        message: "Error registrando usuario",
        data: error.message,
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
      res.status(500).json({
        allOK: false,
        message: "Error leyendo usuarios",
        data: error.message,
      });
    }
  },

  readOne: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await UsuarioModel.findById(id);
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
      res.status(500).json({
        allOK: false,
        message: "Error leyendo usuario",
        data: error.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombres, apellidos, email, cell, password } = req.body;

      const usuario = await UsuarioModel.findById(id);
      if (!usuario) {
        return res.status(404).json({
          allOK: false,
          message: "Usuario no encontrado para actualizar",
          data: null,
        });
      }

      usuario.nombres = nombres;
      usuario.apellidos = apellidos;
      usuario.email = email;
      usuario.cell = cell;

      if (password) {
        usuario.password = password; // asignamos la password sin hashear
      }

      await usuario.save(); // aquí se hashea si password fue modificado

      res.status(200).json({
        allOK: true,
        message: "Usuario actualizado",
        data: usuario,
      });
    } catch (error) {
      res.status(500).json({
        allOK: false,
        message: "Error actualizando usuario",
        data: error.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const usuarioEliminado = await UsuarioModel.findByIdAndDelete(id);

      if (!usuarioEliminado) {
        return res.status(404).json({
          allOK: false,
          message: "Usuario no encontrado para eliminar",
          data: null,
        });
      }

      res.status(200).json({
        allOK: true,
        message: "Usuario eliminado",
        data: null,
      });
    } catch (error) {
      res.status(500).json({
        allOK: false,
        message: "Error eliminando usuario",
        data: error.message,
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
      usuario.emailToken = null; // eliminar token para que no se reutilice

      await usuario.save();

      res.status(200).json({
        allOK: true,
        message: "Correo verificado correctamente",
        data: null,
      });
    } catch (error) {
      res.status(500).json({
        allOK: false,
        message: "Error verificando correo",
        data: error.message,
      });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const usuario = await UsuarioModel.findOne({ email });

      if (!usuario) {
        return res.status(404).json({
          allOK: false,
          message: "Usuario no encontrado",
          data: null,
        });
      }

      if (!usuario.isVerified) {
        return res.status(401).json({
          allOK: false,
          message: "Correo no verificado",
          data: null,
        });
      }

      const isMatch = await bcrypt.compare(password, usuario.password);
      if (!isMatch) {
        return res.status(401).json({
          allOK: false,
          message: "Contraseña incorrecta",
          data: null,
        });
      }

      const token = jwt.sign(
        { id: usuario._id, email: usuario.email },
        JWT_SECRET,
        { expiresIn: "1h" }
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
          },
        },
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({
        allOK: false,
        message: "Error en el servidor",
        data: error.message,
      });
    }
  },
};

export default UsuariosController;


