import { Request, Response, NextFunction } from "express";


export function isAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.user && req.user.userRole && req.user.userRole.name === 'admin') {
        return next();
    } else {
        return res.status(403).json({
            status: 403,
            name: 'Authorization Error',
            message: 'Access denied. Only admins can perform this action.',
        });
    }
}