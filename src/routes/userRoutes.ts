import {Router} from 'express'
import { AppDataSource } from '../DataSource'
import { User } from "../entity/User"
import { Role } from '../entity/Role'
import bcrypt, { hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateJWT } from '../middleware/authMiddleware';
import { isAdmin } from '../middleware/adminMiddleware';


//criar Router
const router = Router()

//iniciar o uso da autenticação jwt
router.use(authenticateJWT);
router.use(isAdmin)


//Listar usuários do banco de dados
router.get('/', async (req, res) => {
    console.log('Usuário autenticado:', req.user);
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({ relations: ['role'] });
    res.json({
        data: users,
    });
});

//Listar somente um usuário do banco de dados, passando a variável :id direto na URL
router.get('/:id', async (req, res)=>{
    const { id } = req.params
    //const id = req.params.id
    const userRepository = AppDataSource.getRepository(User)

    //Procurar pelo ID que foi passado, e pelo relacionamento preenchido
    const user = await userRepository.findOne({
        where:{
        id: parseInt(id)
    },
    relations: ['role']
})

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
router.post('/', async(req, res) => {
    const {name, username, email, password, role} = req.body

    if(!name || !username || !email || !password || !role){
        return res.status(400).json({
            error:{
                status: "400",
                name: "Erro de validação",
                message: "Você esqueceu de preencher um campo obrigatório"
            }
        })
    }

    const userRepository = AppDataSource.getRepository(User)
    const roleRepository = AppDataSource.getRepository(Role)

    let roleInDB = await roleRepository.findOne({ where:{ name: role }})


    if(!roleInDB){
        roleInDB = roleRepository.create({ name: role })
        await roleRepository.save(roleInDB)
    }

    const hashedPassword = bcrypt.hashSync(password, 10)

//Usuário criado
    const newUser: User = userRepository.create({
        name,
        username,
        email,
        password: hashedPassword,
        role: roleInDB
    })

    await userRepository.save(newUser)

    // Gerar o token
    const token = jwt.sign({ id: newUser.id, username: newUser.username }, 'meu_web_token', { expiresIn: '1h' });

    // Logs
    console.log('Novo usuário criado:', newUser);
    console.log('Token gerado:', token);

    res.status(200).json({
        data: newUser,
        token: token  // Inclua o token na resposta
    });
    
})


//Atualizar usuário no banco de dados
router.put('/:id', async (req, res)=>{
    const { id } = req.params
    const {name, username, email, password, role} = req.body
    const userRepository = AppDataSource.getRepository(User)
    const roleRepository = AppDataSource.getRepository(Role)
    const user = await userRepository.findOne({
        where:{
        id: parseInt(id)
    },
    relations: ['role']
})
    if(!user){
        return res.status(404).json({
            error:{
                status: 404,
                name: "NotFound",
                message: "Usuário não encontrado"
            }
        })
    }

    let roleInDB = await roleRepository.findOne({where: { name: role }})

    if(!roleInDB){
        roleInDB = roleRepository.create({ name: role })
        await roleRepository.save(roleInDB)
    }

//Se o novo nome for enviado, a atualização será feita, senão, não será
    
    user.name = name || user.name,
    user.username = username || user.username,
    user.email = email || user.email,
    user.password = password || user.password,
    user.role || roleInDB,

    userRepository.save(user)
    res.status(200).json({
        data: user
    })
})

//Deletar usuários do banco de dados
router.delete('/:id', async (req, res)=>{
    const { id } = req.params
    const userRepository = AppDataSource.getRepository(User)

    //Procurar pelo ID que foi passado, e pelo relacionamento preenchido
    const user = await userRepository.findOne({
        where:{
        id: parseInt(id)
    },
    relations: ['role']
    })

    if(!user){
        return res.status(404).json({
            error:{
                status: 404,
                name: "NotFound",
                message: "Usuário não encontrado"
            }
        })
    }
    //remover o usuário do vetor
    userRepository.remove(user)
    res.status(200).json({
        data: user
    })


})

//exportar router
export default router