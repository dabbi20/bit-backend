import { Schema, model } from "mongoose";

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

export default model("Usuario", usuarioSchema);


