import generarJWR from "../helpers/generarJWT.js";
import Veterinario from "../models/Veterinario.js";
import generarId from "../helpers/generarID.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidepassword from "../helpers/emailOlvidePassword.js";





const registrar = async (req, res) => {
    const { email,nombre } = req.body;

    //prevenir usuarios duplicados

    const existeUsuario = await Veterinario.findOne({ email })
    // en caso de que llegue a existir ejecuta el siguiente codigo
    if (existeUsuario) {
        // crear un nueva variable objecto de error 
        const error = new Error('usuario ya registrado');
        //cambiarle el status del servidor a 400
        return res.status(400).json({ msg: error.message })
    }

    try {
        //guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        //enviar el email 
        emailRegistro({nombre,email,token: veterinarioGuardado.token})

        res.json(veterinarioGuardado);

    } catch (error) {
        console.log(error)
    }


}


const perfil = (req, res) => {

    //obtener los datos del servidor

    const { veterinario } = req

    res.json({ veterinario })
}

const confirmar = async (req, res) => {
    const { token } = req.params
    //vamos a utilizar findOne para buscar uno de nuestros documentos el token 
    const usuarioConfirmar = await Veterinario.findOne({ token})
    if (!usuarioConfirmar) {
        // en caso de que no encuentre ese token dira usuario no valido
        const error = new Error('token no valido')
        return res.status(404).json({ msg: error.message })
    }

    // entonces como es un objeto que nos devuelte todos los datos 
    // podemos modificar el objeto o crear una variable 
    //utilyzamos trycatch
    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true
        //.save() guarda los datos en la base de datos si no no guardara nada y lo dejara como esta
        await usuarioConfirmar.save();
        res.json({ msg: "usuario confirmado correctamente" })

    } catch (error) {
        console.log(error)
    }



}

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    //comprobar si el usuario existe

    const usuario = await Veterinario.findOne({ email });
    if (!usuario) {
        const error = new Error('el usuario no existe')
        return res.status(403).json({ msg: error.message })
    }

    //comprobar si el usuario esta confirmado o no
    if (!usuario.confirmado) {
        const error = new Error('tu cuenta no ha sido confirmada')
        return res.status(403).json({ msg: error.message })
    }

    // revisar si la contrasena esta bien
    if (await usuario.comprobarPassword(password)) {
        // autenticar 

        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            web: usuario.web,
            telefono: usuario.telefono,
            token: generarJWR(usuario.id),
        })

    } else {
        const error = new Error('password es incorrecto')
        return res.status(403).json({ msg: error.message })
    }



}

const olvidepassword = async (req, res,next) => {

   
        const { email } = req.body;
        const existeVeterinario = await Veterinario.findOne({email})
    if(!existeVeterinario){
         const error = new Error('el usuario no existe')
         res.status(400).json({msg: error.message})
    }

    try {
        existeVeterinario.token =  generarId()
        await existeVeterinario.save()

        //enviar email con instrucciones

        emailOlvidepassword({
            email,
            nombre: existeVeterinario.nombre,
            token:existeVeterinario.token
        })


        res.json({msg: 'hemos enviado un email con las instrucciones'})
    } catch (error) {
        console.log(error)
    }
   

    next();
}

const comprobartoken = async (req,res)=>{
// para acceder a los datos de la  url con 2 puntos mejor dicho dinamica /:token  es con req.params
//req.body para acceder a la informacion de un formulario

const {token} = req.params
const tokenValido = await Veterinario.findOne({token})

if(tokenValido){
    // el token es valido el usuario existe
    res.json({msg:'token valido y el usuario ya existe'})
}else{
    const error = new Error('token no valido')
return res.status(400).json({msg:error.message})
}

};

const nuevoPassword = async (req,res)=>{

    const {token} = req.params;
    const{password} = req.body;

    const veterinario = await Veterinario.findOne({token})
    if(!veterinario){
        const error = new Error('token no valido ')
        return res.status(400).json({msg:error.message})
    }

    try {
        // reescribir las propiedades del cambio de usuario
        veterinario.token = null
        veterinario.password = password;
        await veterinario.save();
        res.json({msg: 'password modificado correctamente'})
       //
       

    } catch (error) {
        console.log(error)
    }


}

const actualizarPerfil = async (req,res) => {
       const veterinario = await Veterinario.findById(req.params.id);
        if(!veterinario){
            const error = new Error('hubo un error')
            return res.status(400).json({msg:error.message})
        }

        const {email} = req.body
        if(veterinario.email !== req.body.email){
            const existeEmail = await Veterinario.findOne({email})
            if(existeEmail){
                const error = new Error('hese email ya esta en uso')
                return res.status(400).json({msg:error.message})
            }
        }

        try {

            veterinario.nombre = req.body.nombre || veterinario.nombre
            veterinario.email = req.body.email || veterinario.email
            veterinario.web = req.body.web || veterinario.web
            veterinario.telefono = req.body.telefono || veterinario.telefono

            const veterinarioActualizado = await veterinario.save()
            res.json(veterinarioActualizado)
            
        } catch (error) {
            console.log(error)
        }

}

const actualizarPassword = async (req,res) =>{
    //leer los datos

    const {id} = req.veterinario
    const {pwd_actual,pwd_nuevo} = req.body


    //comprobar que el veterinario exista

    const veterinario = await Veterinario.findById(id)
    if(!veterinario){
        const error = new Error('hubo un error')
        return res.status(400).json({msg:error.message})
    }



    //comprobar su password

    if(await veterinario.comprobarPassword(pwd_actual)){
        veterinario.password = pwd_nuevo

        await veterinario.save();
        res.json({msg:' password Almacenado Correctamente'})

    }else{
        const  error = new Error('El password es Incorrecto');
        return res.status(400).json({msg:error.message});
    }

    //almacenar el nuevo password
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidepassword,
    comprobartoken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}


