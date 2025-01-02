import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Balance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, default:0 })
  amount: number;
}