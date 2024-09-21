import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from './entity/User'
import { Role } from './entity/Role'
import { Table } from './entity/Table'

// Cria uma nova instância de DataSource para configurar a conexão com o banco de dados
export const AppDataSource = new DataSource({
    // Define o tipo de banco de dados como SQLite
    type: "sqlite",
    // Nome do arquivo do banco de dados SQLite
    database: "mydatabase.sqlite",
    // Sincroniza automaticamente a estrutura do banco de dados com as entidades definidas
    synchronize: true,
    // Lista as entidades que serão usadas no banco de dados
    entities: [User, Role, Table] 
})
