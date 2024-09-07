import {openDb} from './configDatabase.js';
//import { createTable, insertCliente, updateCliente, selectClientes, selectCliente, deleteCliente } from './Controller/cliente.js'
import express from 'express';


const app = express();
app.use(express.json());

//abrir conexão com o banco de dados SQlite

const port = 8090;

//app.get('/', function (req, res){
//    res.send("hello world");
//})

//rota para mostrar todos os clientes
/*app.get('/clientes', async function (req, res){
    let clientes = await selectClientes();
    res.json(clientes);
    
})
//rota para mostrar um só cliente
app.get('/cliente', async function (req, res){
    let clientes = await selectCliente(req.body.id);
    res.json(clientes);
    
})
//rota para criar um cliente
app.post('/cliente', function(req, res){
    
    insertCliente(req.body)
    res.json({
        "statuscCode": 200
    })
});
//rota para atualizar o cliente
app.put('/cliente', function(req, res){

    if(req.body && !req.body.id){
        res.json({
            "statusCode": "400",
            "msg": "Você precisa informar um id!"
        })
    }else{
        updateCliente(req.body)
        res.json({
            "statusCode": 200
        })
    }
    
});
//Rota para excluir o cliente
app.delete('/cliente', async function(req, res){
    
    let cliente = await deleteCliente(req.body.id)
    res.json(cliente);
});*/

app.listen(port, ()=> console.log("api rodando na porta",`${port}`))

