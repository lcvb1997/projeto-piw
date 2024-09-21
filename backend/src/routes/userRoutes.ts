import { Router } from 'express';
import { AppDataSource } from '../DataSource';
import { User } from '../entity/User';
import { Role } from '../entity/Role';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateJWT } from '../middleware/authMiddleware';
import { isAdmin } from '../middleware/adminMiddleware';

const router = Router();

// Listar usuários do banco de dados
router.get('/', async (req, res) => {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({ relations: ['role'] });
    res.json({ data: users });
});

// Listar um usuário pelo ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['role'],
    });

    if (!user) {
        return res.status(404).json({
            error: {
                status: 404,
                name: 'NotFound',
                message: 'Usuário não encontrado',
            },
        });
    }
    res.json({ data: user });
});

// Criar um novo usuário
router.post('/', async (req, res) => {
    const { name, username, email, password, role } = req.body;

    if (!name || !username || !email || !password || !role) {
        return res.status(400).json({
            error: {
                status: '400',
                name: 'Erro de validação',
                message: 'Você esqueceu de preencher um campo obrigatório',
            },
        });
    }

    const userRepository = AppDataSource.getRepository(User);
    const roleRepository = AppDataSource.getRepository(Role);

    let roleInDB = await roleRepository.findOne({ where: { name: role } });

    if (!roleInDB) {
        roleInDB = roleRepository.create({ name: role });
        await roleRepository.save(roleInDB);
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = userRepository.create({
        name,
        username,
        email,
        password: hashedPassword,
        role: roleInDB,
    });

    await userRepository.save(newUser);

    // Gerar token JWT
    const token = jwt.sign({ id: newUser.id, username: newUser.username }, 'meu_web_token', { expiresIn: '1h' });

    res.status(200).json({ data: newUser, token });
});

// Atualizar um usuário
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, username, email, password, role } = req.body;

    const userRepository = AppDataSource.getRepository(User);
    const roleRepository = AppDataSource.getRepository(Role);

    const user = await userRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['role'],
    });

    if (!user) {
        return res.status(404).json({
            error: {
                status: 404,
                name: 'NotFound',
                message: 'Usuário não encontrado',
            },
        });
    }

    let roleInDB = await roleRepository.findOne({ where: { name: role } });

    if (!roleInDB) {
        roleInDB = roleRepository.create({ name: role });
        await roleRepository.save(roleInDB);
    }

    // Atualizar apenas os campos que forem enviados
    user.name = name || user.name;
    user.username = username || user.username;
    user.email = email || user.email;
    user.password = password ? bcrypt.hashSync(password, 10) : user.password;
    user.role = roleInDB || user.role;

    await userRepository.save(user);

    res.status(200).json({ data: user });
});

// Deletar um usuário
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['role'],
    });

    if (!user) {
        return res.status(404).json({
            error: {
                status: 404,
                name: 'NotFound',
                message: 'Usuário não encontrado',
            },
        });
    }

    await userRepository.remove(user);

    res.status(200).json({ data: user });
});

// Adicionar rota de reservas do usuário
router.get('/reservations/:id', async (req, res) => {
    const { id } = req.params;
    // Lógica para obter as reservas de mesas de um usuário específico
    // const reservations = await reservationRepository.find({ where: { userId: id } });

    // Simulação de resposta
    res.json({ message: `Reservas do usuário com ID: ${id}`, data: [] });
});

export default router;
