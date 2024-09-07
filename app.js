/*import express from 'express';
import fs from 'fs';
import https from 'https';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

//Importando rotas
import router from './routes.js'
app.use(router);

//apenas caso necessite de um certificado
 https.createServer({
    cert: fs.readFileSync('src/SSL/code.crt'),
    key: fs.readFileSync('src/SSL/code.key')
}, app).listen(8091, ()=> console.log("Api rodando no https"));*/
const express = require("express");
const sequelize = require("./config/database");

const app = express();

sequelize.sync().then(() => console.log("DB conectada com sucesso"));

app.use(express.json());


//Qual porta a api está rodando
const port = 8090;
app.listen(port, ()=> console.log("Api rodando na porta",`${port}`));