import UsuarioModel from "../models/usuario.js"


const UsuariosCrontoller ={
    create: async (req , res)=>{
 
        try {
            res.send('post coriendo!') 
        } catch (error) {
            res.send('post error!')
        }
},
    readAll: async (req , res)=>{
  res.send('getAll coriendo!') 
        try {
            
        } catch (error) {
             res.send('getAll error!')
        }
},
    readOne: async (req , res)=>{
  
        try {
            res.send('getOne coriendo!') 
        } catch (error) {
             res.send('getOne error!')
        }
},
    update: async (req , res)=>{
 
        try {
            res.send('put coriendo!') 
        } catch (error) {
            res.send('put error!') 
        }
},
    delete: async (req , res)=>{
  
        try {
            res.send('delete coriendo!') 
        } catch (error) {
             res.send('delete error!')
        }
},
};

export default UsuariosCrontoller;