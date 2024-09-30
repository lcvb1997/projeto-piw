import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Role } from "./Role";
import { Table } from "./Table";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    username!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @ManyToOne(() => Role, role => role.users)
    role!: Role;

    @OneToMany(() => Table, table => table.user, { onDelete: 'CASCADE' }) // adicionado onDelete: 'CASCADE'
    tables?: Table[];
}
