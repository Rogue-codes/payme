import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum PAYMENT_STATUS {
  PENDING = 'PENDING',
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
}

export enum PAYMENT_TYPE {
  CREDIT = 'CR',
  DEBIT = 'DR',
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PAYMENT_STATUS,
    default: PAYMENT_STATUS.PENDING,
  })
  status: PAYMENT_STATUS;

  @Column({ length: 100, nullable: true })
  paymentRef: string;

  @Column({
    type: 'enum',
    enum: PAYMENT_TYPE,
  })
  paymentType: PAYMENT_TYPE;

  @Column({ length: 255, nullable: true })
  narration: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
