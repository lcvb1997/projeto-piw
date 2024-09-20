import { Router } from 'express';
import { AppDataSource } from '../DataSource';
import { Table } from '../entity/Table';
import { authenticateJWT } from '../middleware/authMiddleware';

// Criar Router
const router = Router();

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

// Adicionar uma nova mesa ao banco de dados
router.post('/', async (req, res) => {
    const { number, capacity } = req.body;

    if (!number || !capacity) {
        return res.status(400).json({
            error: {
                status: "400",
                name: "Erro de validação",
                message: "Você esqueceu de preencher um campo obrigatório"
            }
        });
    }

    const tableRepository = AppDataSource.getRepository(Table);
    const newTable = tableRepository.create({ number, capacity });
    
    await tableRepository.save(newTable);
    res.status(201).json({ data: newTable });
});

// Atualizar uma mesa no banco de dados
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { number, capacity, isBooked } = req.body;
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

    table.number = number || table.number;
    table.capacity = capacity || table.capacity;
    table.isBooked = isBooked !== undefined ? isBooked : table.isBooked;

    await tableRepository.save(table);
    res.status(200).json({ data: table });
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
