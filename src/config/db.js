import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_ATLAS_URI)
        console.log("MongoDB Atlas conectado");
    } catch (error) {
        console.log("Monfo BD Atlas no se pudo conectar", error);
    }
}

export default connectDB; 