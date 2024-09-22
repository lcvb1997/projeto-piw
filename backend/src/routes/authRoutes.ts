import { Router } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from "../DataSource";
import { User } from "../entity/User";

// Cria uma instância do Router
const router = Router();

// Rota para login do usuário
router.post('/login', async (req, res) => {
    // Extrai username e password do corpo da requisição
    const { username, password } = req.body;

    // Obtém o repositório de usuários
    const userRepository = AppDataSource.getRepository(User);

    // Busca um usuário com o username fornecido
    const user = await userRepository.findOne({ 
        where: { username: username },
        relations: ['role'] 
    });

    console.log('Usuário encontrado:', user); // Log para depuração

    // Verifica se o usuário existe
    if (!user) {
        return res.status(404).json({
            status: 404,
            name: 'User Not Found',
            message: 'Username or Password invalid'
        });
    }

    console.log('Senha fornecida:', password);
    console.log('Senha armazenada (hash):', user.password);
    
    // Verifica se a senha fornecida corresponde à senha armazenada
    const passwordMatch = bcrypt.compareSync(password, user.password);
    console.log('As senhas correspondem?', passwordMatch); // Adicione isso para ver o resultado da comparação

    if (passwordMatch) {
        // Gera um token JWT com o id e a role do usuário
        const token = jwt.sign({
            userId: user.id,
            userRole: user.role
        }, 'meu_web_token', { expiresIn: '1h' });

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
                jwt: token
            }
        });
    } else {
        // Se a senha não corresponder
        return res.status(401).json({
            status: 401,
            name: 'Authorization Error',
            message: 'Username or Password invalid'
        });
    }
});

// Rota para logout do usuário
router.get('/logout', (req, res) => {
    res.status(200).json({
        data: {
            message: "Logout realizado com sucesso"
        }
    });
});

export default router;
