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

// Rota para criar uma nova mesa no banco de dados
router.post('/', isAdmin, async (req, res) => {
    const { number, capacity } = req.body; // Supondo que você vai receber o número e a capacidade da mesa no corpo da requisição
    const tableRepository = AppDataSource.getRepository(Table);

    const newTable = new Table();
    newTable.number = number;
    newTable.capacity = capacity;
    newTable.isBooked = false; // Inicialmente, a mesa não está reservada

    try {
        const savedTable = await tableRepository.save(newTable);
        res.status(201).json({ data: savedTable }); // Retorna a mesa criada
    } catch (error) {
        console.error('Erro ao criar mesa:', error);
        res.status(500).json({
            error: {
                status: 500,
                message: 'Erro ao processar a criação da mesa.'
            }
        });
    }
});

router.put('/:id', async (req, res) => {
    console.log('PUT request received for id:', req.params.id);

    const { isBooked } = req.body; // Pega apenas isBooked
    const userId = req.user.id; // Pega o userId a partir do token JWT (usuário autenticado)
    const tableRepository = AppDataSource.getRepository(Table);
    const userRepository = AppDataSource.getRepository(User);

    try {
        const user = await userRepository.findOneBy({ id: userId });
        if (!user) {
            return res.status(404).json({
                error: {
                    status: 404,
                    message: 'Usuário não encontrado.'
                }
            });
        }

        const table = await tableRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!table) {
            return res.status(404).json({
                error: {
                    status: 404,
                    message: 'Mesa não encontrada.'
                }
            });
        }

        // Atualiza o isBooked e vincula o usuário
        table.isBooked = isBooked !== undefined ? isBooked : table.isBooked;

        if (table.isBooked === true) {
            table.user = user; // Vincula o usuário se a mesa for reservada
        } else {
            table.user = undefined; // Desvincula o usuário se a mesa não estiver mais reservada
        }

        // Salva a mesa atualizada no banco de dados
        await tableRepository.save(table);
        console.log('Mesa atualizada:', table);

        res.status(200).json({ data: table });
    } catch (error) {
        console.error('Erro ao processar a reserva:', error);
        res.status(500).json({
            error: {
                status: 500,
                message: 'Erro ao processar a reserva.'
            }
        });
    }
});


// Exportar router
export default router;