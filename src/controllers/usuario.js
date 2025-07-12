import UsuarioModel from "../models/usuario.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/sendEmail.js";

const UsuariosController = {
  create: async (req, res) => {
    try {
      const { nombres, apellidos, email, cell, password } = req.body;
      const hashed = await bcrypt.hash(password, 10);
      const emailToken = crypto.randomBytes(32).toString("hex");

      const newUser = new UsuarioModel({
        nombres,
        apellidos,
        email,
        cell,
        password: hashed,
        emailToken,
      });

      await newUser.save();

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

      const updateData = { nombres, apellidos, email, cell };

      if (password) {
        const hashed = await bcrypt.hash(password, 10);
        updateData.password = hashed;
      }

      const usuarioActualizado = await UsuarioModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (!usuarioActualizado) {
        return res.status(404).json({
          allOK: false,
          message: "Usuario no encontrado para actualizar",
          data: null,
        });
      }

      res.status(200).json({
        allOK: true,
        message: "Usuario actualizado",
        data: usuarioActualizado,
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
};

export default UsuariosController;
