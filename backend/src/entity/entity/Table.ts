import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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
}