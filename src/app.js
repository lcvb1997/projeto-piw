const express = require('express');
const app = express();

const port = 8090;

app.get('/', function (req, res){
    res.send("hello world");
})


app.listen(port, ()=> console.log("api rodando na porta",`${port}`))

