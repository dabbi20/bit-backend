import { Schema, model } from "mongoose";
import bcrypt from "bcrypt"; // ⬅️ Agrega esto

const usuarioSchema = new Schema({
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Email inválido"]
  },
  cell: { type: Number, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  emailToken: { type: String }
}, {
  versionKey: false, timestamps: true
});

// ⬇️ Middleware para hashear la contraseña antes de guardar
usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default model("Usuario", usuarioSchema);



