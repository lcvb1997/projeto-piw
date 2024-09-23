import { Request, Response, NextFunction } from "express";

export function isAdmin(req: Request, res: Response, next: NextFunction) {
    console.log('Usuário no middleware isAdmin:', req.user); // Log para depuração
    if (req.user && req.user.role && req.user.role.id === 1) { // Supondo que 1 representa admin
        return next();
    } else {
        return res.status(403).json({
            status: 403,
            name: 'Authorization Error',
            message: 'Acesso negado. Apenas administradores podem realizar esta ação.',
        });
    }
}