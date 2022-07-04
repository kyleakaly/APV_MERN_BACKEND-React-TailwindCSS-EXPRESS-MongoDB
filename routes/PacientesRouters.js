import express  from "express";
import checkAuth from "../middleware/authmiddleware.js";
import { 
    agregarPacientes,
    Obtenerpacientes, 
    actualizarPaciente,
    eliminarPaciente,
    obtenerPaciente} from "../controllers/PacientesControllers.js";


const router = express.Router()
// con router.route(/) nos permite si los controladores tienen la misma url pero solo cambia el method http psot get patch o deleted o put
//con esto podemos unirlo y saltarnos una linea de codigo o si no podriamos hacerlo asi
//router.route('/').post(agregarPacientes).get(Obtenerpacientes)
//obtener informacion
router.get('/', checkAuth, Obtenerpacientes);
//guardar informacion
router.post('/', checkAuth, agregarPacientes)

//put es para actualizar
router.route('/:id').get(checkAuth, obtenerPaciente).put(checkAuth, actualizarPaciente ).delete(checkAuth, eliminarPaciente)


export default router;
