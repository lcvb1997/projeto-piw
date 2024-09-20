import "reflect-metadata"
import {DataSource} from "typeorm"
import {User} from './entity/User'
import {Role} from './entity/Role'
import { Table } from './entity/Table';


export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "mydatabase.sqlite",
    synchronize: true,
    entities: [User, Role, Table]
    
})