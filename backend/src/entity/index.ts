import express from 'express';
import fs from 'fs';
import https from 'https';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import { AppDataSource } from './DataSource';
import tableRoutes from './routes/tableRoutes';

async function startServer() {
    try {
        await AppDataSource.initialize() 
        const app = express();

        app.use(express.json());
        app.use('/tables', tableRoutes);

        //users adicionado aqui para melhor organização do código
        //Router chamado para index.ts
        app.use('/users', userRoutes)
        app.use('/', authRoutes)


        //apenas caso necessite de um certificado
        https.createServer({
        cert: fs.readFileSync('src/SSL/code.crt'),
        key: fs.readFileSync('src/SSL/code.key')
        }, app).listen(8091, ()=> console.log("Api rodando no https"));


        //Qual porta a api está rodando
        const port = 8090;
        app.listen(port, ()=> console.log("Api rodando na porta",`${port}`));

    } catch (e) {
        throw e        
    }  
}
startServer()


