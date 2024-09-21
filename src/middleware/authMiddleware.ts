import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('Cabeçalho de autorização:', authHeader);
    console.log('Token extraído:', token);

    if (!token) {
        console.log('Nenhum token encontrado');
        return res.status(401).json({
            status: 401,
            name: 'Authentication Error',
            message: 'No token found',
        });
    }

    try {
        // Verifique se a chave secreta está correta
        const verified = jwt.verify(token, 'meu_web_token'); // Certifique-se de que a chave seja a mesma usada na geração do token
        console.log('Token verificado:', verified);

        // Verifique se o token contém o campo 'userId'
        if (!verified || typeof verified !== 'object' || !('userId' in verified)) {
            throw new Error('Token payload inválido: falta o campo userId');
        }

        // Atribuir o usuário ao request com userId e userRole
        req.user = {
            id: (verified as any).userId, // Usando userId em vez de id
            role: (verified as any).userRole // Atribuindo a role também, caso necessário
        };
        next();
    } catch (err: any) {
        console.log('Erro ao verificar o token:', err.name, err.message);
        return res.status(403).json({
            status: 403,
            name: err.name || 'Forbidden Error',
            message: err.message || 'Invalid token',
        });
    }
}
