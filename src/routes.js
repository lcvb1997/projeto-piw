import {Router} from "express";
import { createTable, insertCliente, updateCliente, selectClientes, selectCliente, deleteCliente } from './Controller/cliente.js'

const router = Router();
//Ping pra saber se a rota continua rodando
router.get('/', (req, res)=>{
    res.json({
        "statuscode":200,
        "msg": "Api rodando"

    })
});
//Rotas
router.get('/clientes', selectClientes);
router.get('/cliente', selectCliente);
router.post('/cliente', insertCliente);
router.put('/cliente', updateCliente);
router.delete('/cliente', deleteCliente);

export default router;