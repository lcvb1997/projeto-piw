const express = require('express');
const app = express();
app.use(express.json());

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

