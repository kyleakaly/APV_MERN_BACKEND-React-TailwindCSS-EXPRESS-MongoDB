
import Paciente from "../models/Paciente.js";


const agregarPacientes = async (req,res) =>{

    const paciente = new Paciente(req.body)
    paciente.veterinario = req.veterinario._id

try {
    
   const pacienteGuardado = await paciente.save()
    res.json(pacienteGuardado)
} catch (error) {
    console.log(error)
}
}

const Obtenerpacientes = async (req,res) =>{
    //.find() te traera todo los resultados como un arreglo y despues 
    //lo pasamos a jsons
    //el .find() traera todos tenemos que poner.where() que es un codigo de base de datos para seleccionar solo 1 en especifico
    //en .where() adentro ponemos el nombre de la tabla en la base de datos
    //ponemos .equals que significa igual a para que solo sea ese veterinario que pueda verlo
const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario)

res.json(pacientes);
}

const obtenerPaciente = async (req,res) => {
    //params siempre tomara el valor de una url .body tomara el de un formulario
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    //en las comprobaciones le ponemos .toString para que no sea un objectid si no un string
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
return res.json({msg: 'respuesta no valida'})
    }


        res.json({msg:'paciente'})
    

}

const actualizarPaciente = async (req,res) =>{
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.status(404).json({msg:'no encontrado'})
    }
    //en las comprobaciones le ponemos .toString para que no sea un objectid si no un string
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
return res.json({msg: 'respuesta no valida'})
    }

   // actualizar paciente
   //put crea un elemento nuevo o remplaza una representacion del elemento
   //parch aplica modificadores parciales al recurso
   paciente.nombre = req.body.nombre || paciente.nombre;
   paciente.propietario = req.body.propietario || paciente.propietario;
   paciente.email = req.body.email || paciente.email;
   paciente.fecha = req.body.fecha || paciente.fecha;
   paciente.sintomas = req.body.sintomas || paciente.sintomas;

   try {
    const pacienteActualizado = await paciente.save();
    res.json(pacienteActualizado)
   } catch (error) {
    console.log(error)
   }
}


//como eliminar un registro
const eliminarPaciente = async (req,res) =>{
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.status(404).json({msg:'no encontrado'})
    }
    //en las comprobaciones le ponemos .toString para que no sea un objectid si no un string
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
return res.json({msg: 'respuesta no valida'})
    }

    try {
        await paciente.deleteOne()
        res.json({msg: 'paciente eliminado'})
    } catch (error) {
        console.log(error)
    }

}

export{
    agregarPacientes,
    Obtenerpacientes,
    actualizarPaciente,
    eliminarPaciente,
    obtenerPaciente
}

