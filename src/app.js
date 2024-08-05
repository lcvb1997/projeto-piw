import {openDb} from './configDatabase.js';
import express from 'express';


const app = express();
app.use(express.json());


//abrir conexão com o banco de dados SQlite
openDb();

const port = 8090;

app.get('/', function (req, res){
    res.send("hello world");
})



app.post('/cliente', function(req, res){
    console.log(req.body)
    res.json({
        "statuscCode": 200
    })
});
app.listen(port, ()=> console.log("api rodando na porta",`${port}`))

