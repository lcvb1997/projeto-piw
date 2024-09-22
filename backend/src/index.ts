import express from 'express';
import fs from 'fs';
import https from 'https';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import { AppDataSource } from './DataSource';
import tableRoutes from './routes/tableRoutes';
import reservasRouter from './routes/reservaRoutes'


async function startServer() {
    try {
        // Inicializa a conexão com o banco de dados
        await AppDataSource.initialize()
        // Cria uma instância do aplicativo Express
        const app = express();

        app.use(cors());
        app.use(express.json()); 
        app.use('/tables', tableRoutes);

        // Adiciona as rotas de usuários para melhor organização do código
        app.use('/users', userRoutes);
        app.use('/', authRoutes);
        app.use('/reservas', reservasRouter)

        // Apenas se necessário um certificado para HTTPS
        https.createServer({
            // Lê o certificado e a chave do sistema de arquivos
            cert: fs.readFileSync('src/SSL/code.crt'),
            key: fs.readFileSync('src/SSL/code.key')
        }, app).listen(8091, () => console.log("Api rodando no https"));

        // Define a porta para o servidor HTTP
        const port = 8090;
        app.listen(port, () => console.log("Api rodando na porta", `${port}`)); // Inicia o servidor na porta especificada

    } catch (e) {

        throw e        
    }  
}

// Chama a função para iniciar o servidor
startServer();



