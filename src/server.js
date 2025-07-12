import "dotenv/config";
import connectDB from "./config/db.js";
import express from "express";
import morgan from "morgan";
import usuariosRouter from "./routers/usuario.js";

const server = express();
const host = process.env.HOST || "http://localhost";
const port = process.env.PORT || 3000;

connectDB();

server.use(morgan("dev"));
server.use(express.json());

server.use("/usuario", usuariosRouter);

server.get("/", (req, res) => {
  res.send("Root works!");
});

server.listen(port, () => {
  console.log(`Servidor corriendo en: ${host} y en el puerto ${port}`);
});
