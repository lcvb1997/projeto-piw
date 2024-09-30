import { Router } from 'express';
import { AppDataSource } from '../DataSource';
import { User } from '../entity/User';
import { Role } from '../entity/Role';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


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

    // Verifica campos obrigatórios
    if (!name || !username || !email || !password || !role) {
        return res.status(400).json({
            error: {
                status: '400',
                type: 'validation',
                message: 'Você esqueceu de preencher um campo obrigatório.',
            },
        });
    }

    const userRepository = AppDataSource.getRepository(User);
    const roleRepository = AppDataSource.getRepository(Role);

    // Verificar se o email já está cadastrado
    const existingEmail = await userRepository.findOne({ where: { email } });
    if (existingEmail) {
        return res.status(409).json({
            error: {
                status: '409',
                type: 'duplicate',
                message: 'Email já cadastrado.',
            },
        });
    }

    // Verificar se o nome de usuário já está cadastrado
    const existingUsername = await userRepository.findOne({ where: { username } });
    if (existingUsername) {
        return res.status(409).json({
            error: {
                status: '409',
                type: 'duplicate',
                message: 'Nome de usuário já cadastrado.',
            },
        });
    }

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
    const token = jwt.sign(
        { id: newUser.id, username: newUser.username, role: { id: newUser.role.id, name: newUser.role.name } },
        'meu_web_token'
    );

    res.status(201).json({ data: newUser, token }); // 201, criação bem sucedida
});


// Atualizar um usuário
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, username, email, password } = req.body;

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

    // Verifica se o novo nome é igual ao nome atual
    if (name && name === user.name) {
        return res.status(400).json({
            error: {
                status: 400,
                name: 'Erro de validação',
                message: 'O novo nome não pode ser igual ao nome atual.',
            },
        });
    }

    // Verifica se o novo nome de usuário é igual ao nome de usuário atual
    if (username && username === user.username) {
        return res.status(400).json({
            error: {
                status: 400,
                name: 'Erro de validação',
                message: 'O novo nome de usuário não pode ser igual ao nome de usuário atual.',
            },
        });
    }

    // Atualizar apenas os campos que forem enviados
    user.name = name || user.name;
    user.username = username || user.username;
    user.email = email || user.email;

    // Atualizar a senha apenas se a nova senha for diferente da senha atual
    if (password) {
        const isSamePassword = bcrypt.compareSync(password, user.password);
        if (isSamePassword) {
            return res.status(400).json({
                error: {
                    status: 400,
                    name: 'Erro de validação',
                    message: 'A nova senha não pode ser igual à senha atual.',
                },
            });
        } else {
            user.password = bcrypt.hashSync(password, 10);
        }
    }

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

    // Resetar a sequência de IDs se não houver mais usuários
    const userCount = await userRepository.count();
    if (userCount === 0) {
        await AppDataSource.query(`DELETE FROM sqlite_sequence WHERE name='user';`);
    }

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

// Exportar router
export default router;