import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://david20:bit2025@cluster0.ae4ssad.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("MongoDB Atlas conectado");
  } catch (error) {
    console.log("Monfo BD Atlas no se pudo conectar", error);
  }
};

export default connectDB;


