import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'



interface CustomizeRequest extends Request {
    user: any
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers[('authorization')]
    const token = authHeader && authHeader.split('')[1]


    if(!token){
        return res.json(401).json({
            status: 401,
            name: 'Authentication Error',
            message: 'No token found'
        })
    }

    try {
        const verified = jwt.verify(token, 'meu_web_token')
        req.user = verified
        next()
    } catch (err) {
        return res.status(403).json({
            status: 403,
            name: 'Forbidden Error',
            message: 'Invalid token'
        })
        
    }
}