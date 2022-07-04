import jwt  from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

// crearemos una funcion para proteger las rutas de las personas registradas que tengan acceso a diferentes lugares
//puedes crear middleware para revisar si un usuario pago o cuando pago
//ir restringiendo algunas partes de tu aplicacion
const checkAuth = async (req,res,next)=>{

    let token;
    //.startswith comprueba que el primer elemento al principio contenga estos caracteres
if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
try {
    token = req.headers.authorization.split(' ')[1];
    //metodo para verificar el usuario
    const decoded =  jwt.verify(token, process.env.JWT_SECRET);

    req.veterinario =  await Veterinario.findById(decoded.id).select('-password -token -confirmado')
 

return next();

} catch (error) {
    const e = new Error('token no valido ');

return res.status(403).json({msg:e.message})
}
}


if(!token){
    const error = new Error('token no valido eh inexistente');
    res.status(403).json({msg:error.message})
}




next();
}

export default checkAuth;