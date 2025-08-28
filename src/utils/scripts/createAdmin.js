import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import UsuarioModel from '../../models/UsuarioModel.js';

// Cargar variables de entorno
dotenv.config();

// Datos del administrador
const adminData = {
  nombres: 'Admin',
  apellidos: 'Sistema',
  email: 'admin@example.com',
  cell: '1234567890',
  password: 'Admin123!', // Contraseña por defecto, debería ser cambiada después
  rol: 'admin',
  estado: 'activo',
  isVerified: true
};

// Función para conectar a la base de datos
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a la base de datos');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  }
};

// Función para crear el usuario administrador
const createAdmin = async () => {
  try {
    // Verificar si ya existe un administrador
    const existingAdmin = await UsuarioModel.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('El administrador ya existe en la base de datos');
      // Actualizar el usuario existente a administrador por si acaso
      existingAdmin.rol = 'admin';
      existingAdmin.estado = 'activo';
      existingAdmin.isVerified = true;
      await existingAdmin.save();
      console.log('Usuario existente actualizado a administrador');
    } else {
      // Crear un nuevo administrador
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);
      
      const admin = new UsuarioModel({
        ...adminData,
        password: hashedPassword
      });
      
      await admin.save();
      console.log('Administrador creado exitosamente');
    }
    
    console.log('Datos del administrador:');
    console.log(`Email: ${adminData.email}`);
    console.log(`Contraseña: ${adminData.password}`);
    console.log('\nIMPORTANTE: Cambia la contraseña después del primer inicio de sesión');
    
    process.exit(0);
  } catch (error) {
    console.error('Error al crear el administrador:', error);
    process.exit(1);
  }
};

// Ejecutar el script
(async () => {
  await connectDB();
  await createAdmin();
})();
