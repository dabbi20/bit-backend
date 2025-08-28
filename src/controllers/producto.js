import ProductoModel from "../models/ProductoModel.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de almacenamiento de imágenes
const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Asegurar que el directorio de subidas exista
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ProductoController = {
  // Crear un nuevo producto
  create: async (req, res) => {
    try {
      const { nombre, descripcion, precio, stock, categoria } = req.body;
      const imagenes = [];

      // Procesar archivos subidos
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          const fileName = `${Date.now()}-${file.originalname}`;
          const filePath = path.join(UPLOAD_DIR, fileName);
          
          // Mover el archivo al directorio de subidas
          fs.renameSync(file.path, filePath);
          
          // Guardar la ruta relativa de la imagen
          imagenes.push(`/uploads/${fileName}`);
        });
      }

      const nuevoProducto = new ProductoModel({
        nombre,
        descripcion,
        precio: parseFloat(precio),
        stock: parseInt(stock, 10),
        categoria,
        imagenes,
        creadoPor: req.userId // Asumiendo que el ID del usuario viene del token
      });

      await nuevoProducto.save();

      res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: nuevoProducto
      });
    } catch (error) {
      console.error('Error al crear el producto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear el producto',
        error: error.message
      });
    }
  },

  // Obtener todos los productos (con paginación y filtros)
  getAll: async (req, res) => {
    try {
      const { page = 1, limit = 10, categoria, search } = req.query;
      const query = { estado: 'activo' };

      if (categoria) {
        query.categoria = categoria;
      }

      if (search) {
        query.$text = { $search: search };
      }

      const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { fechaCreacion: -1 },
        populate: {
          path: 'creadoPor',
          select: 'nombres apellidos email'
        }
      };

      const productos = await ProductoModel.paginate(query, options);

      res.status(200).json({
        success: true,
        data: productos
      });
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los productos',
        error: error.message
      });
    }
  },

  // Obtener un producto por ID
  getById: async (req, res) => {
    try {
      const producto = await ProductoModel.findById(req.params.id)
        .populate('creadoPor', 'nombres apellidos email');

      if (!producto) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: producto
      });
    } catch (error) {
      console.error('Error al obtener el producto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el producto',
        error: error.message
      });
    }
  },

  // Actualizar un producto
  update: async (req, res) => {
    try {
      const { nombre, descripcion, precio, stock, categoria } = req.body;
      const imagenes = [];

      // Procesar nuevas imágenes si se suben
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          const fileName = `${Date.now()}-${file.originalname}`;
          const filePath = path.join(UPLOAD_DIR, fileName);
          
          // Mover el archivo al directorio de subidas
          fs.renameSync(file.path, filePath);
          
          // Guardar la ruta relativa de la imagen
          imagenes.push(`/uploads/${fileName}`);
        });
      }

      const updateData = {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        stock: parseInt(stock, 10),
        categoria
      };

      // Si hay nuevas imágenes, reemplazar las existentes
      if (imagenes.length > 0) {
        updateData.imagenes = imagenes;
      }

      const productoActualizado = await ProductoModel.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!productoActualizado) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Producto actualizado exitosamente',
        data: productoActualizado
      });
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el producto',
        error: error.message
      });
    }
  },

  // Eliminar un producto (cambio de estado a inactivo)
  delete: async (req, res) => {
    try {
      const productoEliminado = await ProductoModel.findByIdAndUpdate(
        req.params.id,
        { estado: 'inactivo' },
        { new: true }
      );

      if (!productoEliminado) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Producto eliminado exitosamente',
        data: productoEliminado
      });
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el producto',
        error: error.message
      });
    }
  },

  // Eliminar imagen de un producto
  deleteImage: async (req, res) => {
    try {
      const { productoId, imageName } = req.params;
      
      const producto = await ProductoModel.findById(productoId);
      if (!producto) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }

      // Encontrar la ruta completa de la imagen
      const imagePath = path.join(__dirname, '../../', imageName);
      
      // Verificar si el archivo existe y eliminarlo
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      // Actualizar el producto para eliminar la referencia de la imagen
      producto.imagenes = producto.imagenes.filter(img => !img.includes(imageName));
      await producto.save();

      res.status(200).json({
        success: true,
        message: 'Imagen eliminada exitosamente',
        data: producto
      });
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar la imagen',
        error: error.message
      });
    }
  }
};

export default ProductoController;
