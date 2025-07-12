import UsuarioModel from "../models/usuario.js";

const UsuariosCrontoller = {
  create: async (req, res) => {
    try {
      const { fullName, birtDate, status, age } = req.body;
      const newUsuario = new UsuarioModel({
        fullName,
        birtDate,
        status,
        age,
      });
      const usuarioCreado = await newUsuario.save();
      res.status(201).json({
        allOK: true,
        message: "Usuario creado correctamente",
        data: usuarioCreado,
      });
    } catch (error) {
      res.status(500).json({
        allOK: false,
        message: "Error creando usuario",
        data: null,
      });
    }
  },
  readAll: async (req, res) => {
    try {
      const usuario = await UsuarioModel.find();
      res.status(200).json({
        allOK: true,
        message: "Todos los usuarios recividos",
        data: usuario,
      });
    } catch (error) {
      res.status(500).json({
        allOK: false,
        message: "Error leyendo todos los usuarios",
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
          message: `usuario con ID ${id} no encontrado`,
        });
      }
      res.status(200).json({
        allOK: true,
        message: `usuario con ID ${id} si encontrado`,
        data: usuario,
      });
    } catch (error) {
      res.status(500).json({
        allOK: false,
        message: "Error leyendo un usuario",
        data: error.message,
      });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { fullName, birtDate, status, age } = req.body;
      const usuarioUpdate = await UsuarioModel.findByIdAndUpdate(
        id,
        {
          fullName,
          birtDate,
          status,
          age,
        },
        { new: true }
      );

      if (!usuarioUpdate) {
        return res.status(404).json({
          allOK: false,
          message: `usuario con ID ${id} no actuazlizado`,
          data: null,
        });
      }
      res.status(200).json({
        allOK: true,
        message: `usuario con ID ${id} si actualizado`,
        data: usuarioUpdate,
      });
    } catch (error) {
      res.status(500).json({
        allOK: false,
        message: "Error actualizando un usuario",
        data: error.message,
      });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const usuarioDeleted = await UsuarioModel.findByIdAndDelete(id);

      if (!usuarioDeleted) {
        return res.status(404).json({
          allOK: false,
          message: `usuario con ID ${id} no borrado`,
          data: null,
        });
      }
      res.status(200).json({
        allOK: true,
        message: `usuario con ID ${id} fue borrado`,
        data: null,
      });
    } catch (error) {
      res.status(500).json({
        allOK: false,
        message: "Error eliminando un usuario",
        data: error.message,
      });
    }
  },
};

export default UsuariosCrontoller;
