import { Router } from 'express';
import { AppDataSource } from '../DataSource';
import { Table } from '../entity/Table';
import { User } from '../entity/User';
import { authenticateJWT } from '../middleware/authMiddleware';
import { isAdmin } from '../middleware/adminMiddleware';

// Criar Router
const router = Router();

// Middleware para autenticação
router.use(authenticateJWT);

// Listar mesas do banco de dados
router.get('/', async (req, res) => {
    const tableRepository = AppDataSource.getRepository(Table);

    try {
        const tables = await tableRepository.find({ relations: ["user"] });
        res.json({ data: tables });
    } catch (error) {
        console.error('Erro ao buscar mesas:', error);
        res.status(500).json({ error: { status: 500, message: 'Erro ao processar a solicitação.' } });
    }
});

// Listar uma mesa específica do banco de dados
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const tableRepository = AppDataSource.getRepository(Table);

    try {
        const table = await tableRepository.findOne({ where: { id: parseInt(id) }, relations: ["user"] });
        if (!table) {
            return res.status(404).json({ error: { status: 404, message: 'Mesa não encontrada' } });
        }
        res.json({ data: table });
    } catch (error) {
        console.error('Erro ao buscar mesa:', error);
        res.status(500).json({ error: { status: 500, message: 'Erro ao processar a solicitação.' } });
    }
});


// Rota para criar uma nova mesa no banco de dados
router.post('/', isAdmin, async (req, res) => {
    const { number, capacity } = req.body;
    const tableRepository = AppDataSource.getRepository(Table);

    const newTable = new Table();
    newTable.number = number;
    newTable.capacity = capacity;
    newTable.isBooked = false;

    try {
        const savedTable = await tableRepository.save(newTable);
        res.status(201).json({ data: savedTable });
    } catch (error) {
        console.error('Erro ao criar mesa:', error);
        res.status(500).json({ error: { status: 500, message: 'Erro ao processar a criação da mesa.' } });
    }
});

// Rota para reservar uma mesa
router.put('/:id', async (req, res) => {
    const { isBooked } = req.body;
    const userId = req.user.id;
    const tableRepository = AppDataSource.getRepository(Table);
    const userRepository = AppDataSource.getRepository(User);

    try {
        const user = await userRepository.findOneBy({ id: userId });
        if (!user) {
            return res.status(404).json({
                error: { status: 404, message: 'Usuário não encontrado.' }
            });
        }

        const table = await tableRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ["user"],
        });

        if (!table) {
            return res.status(404).json({
                error: { status: 404, message: 'Mesa não encontrada.' }
            });
        }

        if (isBooked) {
            if (table.isBooked) {
                return res.status(400).json({ error: { status: 400, message: 'Mesa já reservada.' } });
            }
            table.isBooked = true;
            table.user = user; // associar o usuário à mesa
        } else {
            table.isBooked = false;
            table.user = null; // limpa a associação do usuário
        }

        await tableRepository.save(table);
        console.log('Mesa após atualização:', table);
        res.status(200).json({ data: table });
    } catch (error) {
        console.error('Erro ao processar a reserva:', error);
        res.status(500).json({
            error: { status: 500, message: 'Erro ao processar a reserva.' }
        });
    }
});
// Rota para excluir uma mesa, mesmo que esteja reservada
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const tableRepository = AppDataSource.getRepository(Table);

    try {
        const table = await tableRepository.findOneBy({ id: parseInt(id) });
        if (!table) {
            return res.status(404).json({ error: { status: 404, message: 'Mesa não encontrada' } });
        }

        await tableRepository.remove(table);
        res.status(200).json({ message: 'Mesa excluída com sucesso.' });
    } catch (error) {
        console.error('Erro ao excluir mesa:', error);
        res.status(500).json({ error: { status: 500, message: 'Erro ao processar a exclusão da mesa.' } });
    }
});

// Exportar router
export default router;
