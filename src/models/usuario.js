import { Schema,model } from "mongoose";

const usuarioSchema = new Schema({
   
    fullName:{
        type: String,
    },
    birtDate: {
        type: Date,
    },
    status: {
        type:Boolean,
    },
    age: {
        type:Number,
    },
}, {versionKey:false, timestamps:true }
);

export default model("Usuario", usuarioSchema);