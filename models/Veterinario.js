import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import generarId from '../helpers/generarID.js';



const veterinarioSchema = mongoose.Schema({
    nombre:{
        type:String,
        required:true,
        trim: true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        requiered: true,
        unique:true,
trim:true
    },
    telefono:{
        type:String,
        default:null,
        trim:true
    },
    web:{
        type:String,
        default:null
    },
    token:{
type: String,
default:generarId()
    },
    confirmado:{
        type:Boolean,
        default:false
    }
});

veterinarioSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

veterinarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
//metodo compara los password que esta hasheado con el normal password que manda el usuario
// el compare toma 2 parametros el password y el bcryp
    return await bcrypt.compare(passwordFormulario,this.password)

};

// registrarlo en mongoose como modelo
//pero tenemos que decirle que elemento es el que vamos a utilizar y se lo pasamos como segundo elemento    
// el primer elemento es el nombre que le queremos dar
const Veterinario = mongoose.model('veterinario',veterinarioSchema);

export default Veterinario;

