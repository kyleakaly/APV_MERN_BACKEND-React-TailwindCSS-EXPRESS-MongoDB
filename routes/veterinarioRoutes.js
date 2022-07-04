import express from 'express'
import { registrar,perfil, confirmar, autenticar,olvidepassword,comprobartoken,nuevoPassword,actualizarPerfil,actualizarPassword} from '../controllers/veterinarioControllers.js';
import checkAuth from '../middleware/authmiddleware.js';

const router = express.Router();

//rutas de area publica que no se requieren cuenta 
// siempre tenemos que definir las rutas que requieran cuentas y las que no

//area publica
router.post('/',registrar);
router.get('/confirmar/:token', confirmar);
router.post('/login', autenticar);
router.post('/olvide-password', olvidepassword);
router.get('/olvide-password/:token',comprobartoken);
router.post('/olvide-password/:token',nuevoPassword)
//para proteger nuestras paginas vamos a crear un cumston middlewer o middlewer propio
//la funcion que crearemos sera checkazth crearemos una carpeta aparte con el codigo que reutilizaremos la carpeta se llamara middleware y authmiddleware donde crearemos la funcion de autenticacion de usuario registrado

//area privada
router.get('/perfil',checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil)
router.put('/actualizar-password',checkAuth,actualizarPassword)

export default router;