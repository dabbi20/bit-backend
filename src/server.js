import "dotenv/config";
import connectDB from "./config/db.js";
import express from "express";
import morgan from "morgan";
import cors from "cors";              // <-- Importa cors
import usuariosRouter from "./routers/usuario.js";

const server = express();
const host = process.env.HOST || "http://localhost";
const port = process.env.PORT || 3000;

connectDB();

server.use(morgan("dev"));
server.use(express.json());

// Configura CORS para permitir peticiones desde el frontend
server.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:4200",
  credentials: true,
}));

// Rutas
server.use("/usuario", usuariosRouter);

server.get("/", (req, res) => {
  res.send("Root works!");
});

server.listen(port, () => {
  console.log(`Servidor corriendo en: ${host} y en el puerto ${port}`);
});
