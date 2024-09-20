import {Router} from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from "../entity/User";
import { AppDataSource } from "../DataSource";



const router = Router()

router.post('/login', async (req, res) =>{
    const {username, password} = req.body

    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOneBy({username})

    if(user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({
            userId: user.id,
            userRole: user.role
        }, 'meu_web_token')

        res.status(200).json({data:{
            username: user.username,
            email: user.email,
            jwt: token
        }})
    }else{
        return res.json(401).json({
            status: 401,
            name: 'Authentication Error',
            message: 'Username or Password Invalid'
        })
    }
})

router.get('/logout', (req, res) => {
    res.status(200).json({
        data:{
            message: "Logout realized with success"

    }})
})

export default router