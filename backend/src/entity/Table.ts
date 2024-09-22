import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Table {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    number!: number;

    @Column()
    capacity!: number;

    @Column({ default: false })
    isBooked!: boolean;

    @ManyToOne(() => User, user => user.tables, { nullable: true, onDelete: 'SET NULL' }) // Adicionando onDelete
    user?: User; // O usuário que reservou a mesa
}
