import express from 'express';
import fs from 'fs';
import https from 'https';
import { parse } from 'qs';


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

//Listar usuários do banco de dados
app.get('/users', (req, res) =>{
    res.json({
        data: users
    })
})

//Listar somente um usuário do banco de dados, passando a variável :id direto na URL
app.get('/users/:id', (req, res)=>{
    const { id } = req.params
    //const id = req.params.id

    //id convertido em number para comparação de number com number
    const user = users.find(u => u.id === parseInt(id))

    if(!user){
        return res.status(404).json({
            error:{
                status: 404,
                name: "NotFound",
                message: "Usuário não encontrado"
            }
        })
    }
    res.json({
        data: user
    })
})

//Postar usuário no banco de dados
app.post('/users', (req, res) => {
    const {name, username, email, password, role} = req.body

    if(!name || !username || !email || !password || !role){
        return res.status(400).json(
            {
            status: "400",
            name: "Erro de validação",
            message: "Você esqueceu de preencher um campo obrigatório"
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

//Atualizar usuário no banco de dados
app.put('/users/:id', (req, res)=>{
    const { id } = req.params
    const {name, username, email, password, role} = req.body

    const userIndex = users.findIndex(u => u.id === parseInt(id))

    if(userIndex === -1){
        return res.status(404).json({
            error:{
                status: 404,
                name: "NotFound",
                message: "Usuário não encontrado"
            }
        })
    }
//Se o novo nome for enviado, a atualização será feita, senão, não será
    const updatedUser = {
        id: parseInt(id),
        name: name || users[userIndex].name,
        username: username || users[userIndex].username,
        email: email || users[userIndex].email,
        password: password || users[userIndex].password,
        role: role || users[userIndex].role,
    }
    users[userIndex] = updatedUser
    res.status(200).json({
        data: updatedUser
    })
})

//Deletar usuários do banco de dados
app.delete('/users/:id', (req, res)=>{
    const { id } = req.params
    const userIndex = users.findIndex(u => u.id === parseInt(id))

    if(userIndex === -1){
        return res.status(404).json({
            error:{
                status: 404,
                name: "NotFound",
                message: "Usuário não encontrado"
            }
        })
    }
    //remover o usuário do vetor
    const deletedUser = users.splice(userIndex, 1)[0]
    res.status(200).json({
        data: deletedUser
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