import 'dotenv/config'
import connectDB from './config/db.js';
import express from "express";
import morgan from 'morgan';
import usuariosRouter  from "./routers/usuario.js";

const server = express();
const host = process.env.HOST
const port = process.env.PORT;

//Username: davidack123456789
//Contraseña Q2KvzNB9fKzLnedh

connectDB()

server.use(morgan("dev"));
server.use(express.json());
server.use("/usuario",usuariosRouter)

server.get("/",(request, response)=>{
    response.send("root works!");
});

server.listen( port, ()=>{
console.log(`Se esta corriendo en : ${host} y en el puerto ${port}`)

});

