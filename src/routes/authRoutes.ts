import { Router } from "express"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AppDataSource } from "../DataSource"
import { User } from "../entity/User"

// Cria uma instância do Router
const router = Router()

// Rota para login do usuário
router.post('/login', async (req, res) => {
  // Extrai username e password do corpo da requisição
  const { username, password } = req.body 
  // Obtém o repositório de usuários
  const userRepository = AppDataSource.getRepository(User)
  // Busca um usuário com o username fornecido
  const user = await userRepository.findOne({ 
    where: {
      username: username
    },
    // Inclui as relações com a entidade 'role'
    relations: ['role'] 
  })

  //Verifica se o usuário existe e se a senha fornecida corresponde à senha armazenada
  if (user && bcrypt.compareSync(password, user.password)) {
    // Gera um token JWT com o id e a role do usuário
    const token = jwt.sign({
      userId: user.id,
      userRole: user.role
    //Token expira em 1 hora
    }, 'meu_web_token', { expiresIn: '1h'})

    // Retorna a resposta com os dados do usuário e o token gerado
    res.status(200).json({ 
      data: {
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: {
            id: user.role.id,
            name: user.role.name
          }
        },
        // Inclui o token na resposta
        jwt: token
      }
    })
  } else {
    // Se o usuário não for encontrado ou a senha não corresponder, retorna erro 401
    return res.status(401).json({
      status: 401,
      name: 'Authorization Error',
      message: 'Username or Password invalid'
    })
  }
})

// Rota para logout do usuário
router.get('/logout', (req, res) => {
  // Simplesmente retorna uma mensagem de sucesso para logout, o token não é invalidado aqui
  res.status(200).json({
    data: {
      message: "Logout realized with success"
    }
  })
})

export default router
