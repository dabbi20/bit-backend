import { Router } from "express";

const usuariosRouter = Router();

usuariosRouter.post("/:id", (req , res)=>{
  res.send("post work!");
});

usuariosRouter.get("/:id", (req , res)=>{
  res.send("get all work!");
});

usuariosRouter.get("/:id", (req , res)=>{
  res.send("get one work!");
});

usuariosRouter.put("/:id", (req , res)=>{
  res.send("put work!");
});
usuariosRouter.delete("/:id", (req , res)=>{
  res.send("delete work!");
});

export default usuariosRouter;