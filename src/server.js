import 'dotenv/config'
import express from "express";

const server = express();
const host = process.env.HOST
const port = process.env.PORT;

server.get("/",(request, response)=>{
    response.send("root works!");
});

server.listen( port, ()=>{
console.log(`Se esta corriendo en : ${host} y en el puerto ${port}`)

});

