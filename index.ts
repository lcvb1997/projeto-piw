import express from 'express';
import fs from 'fs';
import https from 'https';


const app = express();
app.use(express.json());


//Informações necessárias na API para criar um usuário
interface User {
    id: number,
    name: string,
    username:string,
    email: string,
    password: string,
    role: string     
}

const users: User[] = []

//Postar usuário no banco de dados
app.post('/users', (req, res) => {
    const {name, username, email, password, role} = req.body

    if(!name || !username || !email || !password || !role){
        return res.status(400).json(
            {
            status: "400",
            name: "Erro de validação",
            message: "Você esqueceu um campo obrigatório"
        })
    }
//Usuário criado
    const newUser: User = {
        id: users.length + 1,
        name,
        username,
        email,
        password,
        role
    }

    users.push(newUser)
    res.status(200).json({
        data: newUser
    })
})


//apenas caso necessite de um certificado
 https.createServer({
    cert: fs.readFileSync('src/SSL/code.crt'),
    key: fs.readFileSync('src/SSL/code.key')
}, app).listen(8091, ()=> console.log("Api rodando no https"));


//Qual porta a api está rodando
const port = 8090;
app.listen(port, ()=> console.log("Api rodando na porta",`${port}`));