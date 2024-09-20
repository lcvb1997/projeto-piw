import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'



interface CustomizeRequest extends Request {
    user: any
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('Cabeçalho de autorização:', authHeader); // Log para verificar o cabeçalho
    console.log('Token extraído:', token); // Log para verificar o token extraído

    if (!token) {
        console.log('Nenhum token encontrado');
        return res.status(401).json({
            status: 401,
            name: 'Authentication Error',
            message: 'No token found',
        });
    }

    try {
        const verified = jwt.verify(token, 'meu_web_token');
        console.log('Token verificado:', verified);
        req.user = verified;
        next();
    } catch (err) {
        console.log('Erro ao verificar o token:', err);
        return res.status(403).json({
            status: 403,
            name: 'Forbidden Error',
            message: 'Invalid token',
        });
    }
    
}
