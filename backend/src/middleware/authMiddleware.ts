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
        const verified = jwt.verify(token, 'meu_web_token');
        console.log('Token verificado:', verified);

        // Atribuir o usuário ao request com id, username e role
        req.user = {
            id: (verified as any).userId, // Acesso ao userId
            username: (verified as any).username || null, // Acesso ao username (se estiver no payload)
            role: (verified as any).userRole || null // Acesso ao userRole (se estiver no payload)
        };
        
        console.log('Usuário autenticado no middleware:', req.user);
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