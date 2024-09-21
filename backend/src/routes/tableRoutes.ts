import { Router } from 'express';
import { AppDataSource } from '../DataSource';
import { Table } from '../entity/Table';
import { User } from '../entity/User'; // Importando a entidade User
import { authenticateJWT } from '../middleware/authMiddleware';
import { isAdmin } from '../middleware/adminMiddleware';

// Criar Router
const router = Router();

// Middleware para autenticação
router.use(authenticateJWT);

// Listar mesas do banco de dados
router.get('/', async (req, res) => {
    const tableRepository = AppDataSource.getRepository(Table);
    const tables = await tableRepository.find();
    res.json({ data: tables });
});

// Listar uma mesa do banco de dados, passando a variável :id na URL
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const tableRepository = AppDataSource.getRepository(Table);
    
    const table = await tableRepository.findOneBy({ id: parseInt(id) });

    if (!table) {
        return res.status(404).json({
            error: {
                status: 404,
                name: "NotFound",
                message: "Mesa não encontrada"
            }
        });
    }
    res.json({ data: table });
});

// Atualizar uma mesa no banco de dados e reservar
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { isBooked } = req.body;
    const userId = req.user.id; // Pega o userId a partir do token JWT (usuário autenticado)
    const tableRepository = AppDataSource.getRepository(Table);
    const userRepository = AppDataSource.getRepository(User); // Repositório do User

    try {
        // Obtém o usuário correspondente ao userId
        const user = await userRepository.findOneBy({ id: userId });
        if (!user) {
            return res.status(404).json({
                error: {
                    status: 404,
                    message: 'Usuário não encontrado.'
                }
            });
        }

        // Verifica se o usuário já reservou alguma mesa
        const existingReservation = await tableRepository.findOne({
            where: { user } // Verifica se há mesa reservada pelo usuário
        });

        if (existingReservation && isBooked) {
            return res.status(400).json({
                error: {
                    status: 400,
                    message: 'Você já reservou uma mesa.'
                }
            });
        }

        // Verifica se a mesa existe
        const table = await tableRepository.findOneBy({ id: parseInt(id) });
        if (!table) {
            return res.status(404).json({
                error: {
                    status: 404,
                    message: 'Mesa não encontrada.'
                }
            });
        }

        // Verifica se a mesa já está reservada
        if (table.isBooked && isBooked) {
            return res.status(400).json({
                error: {
                    status: 400,
                    message: 'Mesa já está reservada.'
                }
            });
        }

        // Atualiza a mesa com o status de reserva e associa ao usuário
        table.isBooked = isBooked !== undefined ? isBooked : table.isBooked;
        table.user = isBooked ? user : undefined; // Associa o usuário completo

        await tableRepository.save(table);

        res.status(200).json({ data: table });
    } catch (error) {
        console.error('Erro ao reservar a mesa:', error);
        res.status(500).json({
            error: {
                status: 500,
                message: 'Erro ao processar a reserva.'
            }
        });
    }
});

// Nova rota para listar as mesas reservadas pelo usuário autenticado
router.get('/reservas/me', async (req, res) => {
    const userId = req.user.id; // Pega o userId a partir do token JWT (usuário autenticado)
    const tableRepository = AppDataSource.getRepository(Table);

    try {
        // Busca as mesas reservadas pelo usuário autenticado
        const reservedTables = await tableRepository.find({
            where: { user: { id: userId }, isBooked: true }
        });

        if (reservedTables.length === 0) {
            return res.status(404).json({
                error: {
                    status: 404,
                    message: 'Nenhuma reserva encontrada para este usuário.'
                }
            });
        }

        res.status(200).json({ data: reservedTables });
    } catch (error) {
        console.error('Erro ao buscar as reservas:', error);
        res.status(500).json({
            error: {
                status: 500,
                message: 'Erro ao processar a solicitação.'
            }
        });
    }
});

// Deletar uma mesa do banco de dados
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const tableRepository = AppDataSource.getRepository(Table);
    
    const table = await tableRepository.findOneBy({ id: parseInt(id) });

    if (!table) {
        return res.status(404).json({
            error: {
                status: 404,
                name: "NotFound",
                message: "Mesa não encontrada"
            }
        });
    }

    await tableRepository.remove(table);
    res.status(200).json({ data: table });
});

// Exportar router
export default router;
