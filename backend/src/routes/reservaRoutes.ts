import { Router } from 'express';
import { AppDataSource } from '../DataSource';
import { Table } from '../entity/Table';
import { authenticateJWT } from '../middleware/authMiddleware';
import { User } from '../entity/User';
import { isAdmin } from '../middleware/adminMiddleware';

// Criar Router
const router = Router();

// Middleware para autenticação
//router.use(authenticateJWT);

// Rota para listar mesas reservadas
router.get('/', async (req, res) => {
    const tableRepository = AppDataSource.getRepository(Table);

    try {
        const reservedTables = await tableRepository.find({
            where: { isBooked: true },
            relations: ["user"], // Se precisar incluir informações do usuário
        });

        res.status(200).json({ data: reservedTables });
    } catch (error) {
        console.error('Erro ao buscar mesas reservadas:', error);
        res.status(500).json({
            error: {
                status: 500,
                message: 'Erro ao processar a solicitação.',
            },
        });
    }
});

// Rota para buscar uma reserva específica pelo ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const tableRepository = AppDataSource.getRepository(Table);

    try {
        const reservation = await tableRepository.findOne({
            where: { id: parseInt(id) },
            relations: ["user"],
        });

        if (!reservation) {
            return res.status(404).json({
                error: {
                    status: 404,
                    message: 'Reserva não encontrada.',
                },
            });
        }

        res.status(200).json({ data: reservation });
    } catch (error) {
        console.error('Erro ao buscar reserva:', error);
        res.status(500).json({
            error: {
                status: 500,
                message: 'Erro ao processar a solicitação.',
            },
        });
    }
});

// Rota para deletar uma reserva de mesa
router.delete('/:id', authenticateJWT, isAdmin, async (req, res) => {
    console.log('DELETE request received for id:', req.params.id);
    const tableRepository = AppDataSource.getRepository(Table);

    try {
        const table = await tableRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!table) {
            return res.status(404).json({
                error: {
                    status: 404,
                    message: 'Mesa não encontrada.'
                }
            });
        }

        // Verifica se a mesa está reservada
        if (!table.isBooked) {
            return res.status(400).json({
                error: {
                    status: 400,
                    message: 'A mesa não está reservada.'
                }
            });
        }

        // Libera a mesa
        table.isBooked = false; // Marca a mesa como não reservada
        table.user = undefined; // Limpa o ID do usuário associado

        await tableRepository.save(table); // Salva a mesa atualizada

        res.status(200).json({ message: 'Reserva deletada com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar a reserva:', error);
        res.status(500).json({
            error: {
                status: 500,
                message: 'Erro ao processar a deleção da reserva.'
            }
        });
    }
});

// Exportar router
export default router;
