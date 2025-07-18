import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = new mongoose.Schema({
  nombres: {
    type: String,
    required: true,
    trim: true
  },
  apellidos: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/
  },
  cell: {
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{10}$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  rol: {
    type: String,
    enum: ['usuario', 'admin'],
    default: 'usuario'
  },
  estado: {
    type: String,
    enum: ['pendiente', 'activo', 'inactivo'],
    default: 'pendiente'
  },
  emailToken: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
usuarioSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;
