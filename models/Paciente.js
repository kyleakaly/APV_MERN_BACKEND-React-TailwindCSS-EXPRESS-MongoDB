import mongoose from 'mongoose'

const pacientesSchema = mongoose.Schema({
    nombre:{
        type:String,
        require : true
    },
    propietario:{
        type:String,
        require : true
    },
    email:{
        type:String,
        require : true
    },
    fecha:{
        type:Date,
        require : true,
        default : Date.now()
    },
    sintomas:{
        type:String,
        require : true
    },

    veterinario : {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'veterinario'
    }

},{
    //para que nos cree las columnas de editado creado eliminado
    timestamps: true,

});


const Paciente = mongoose.model('paciente', pacientesSchema);

export default Paciente;

