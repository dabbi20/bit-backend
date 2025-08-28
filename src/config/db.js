import mongoose from "mongoose";
import 'dotenv/config';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_ATLAS_URI);
    console.log("MongoDB Atlas conectado exitosamente");
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error.message);
    process.exit(1);
  }
};

export default connectDB;

