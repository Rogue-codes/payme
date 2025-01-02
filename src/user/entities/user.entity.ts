import { Length } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum KycStatus {
  NOT_COMPLETED = 'Not Completed',
  COMPLETED = 'Completed',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, nullable: true })
  firstName: string;

  @Column({ length: 50, nullable: true })
  lastName: string;

  @Column({ length: 100, nullable: true })
  stateOfOrigin: string;

  @Column({ length: 200, nullable: true })
  lga: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ length: 500, nullable: true })
  homeAddress: string;

  @Column()
  // @Length(4, 4, { message: 'Transaction PIN must be exactly 4 digits.' })
  transactionPin: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true  })
  password: string;

  @Column({ nullable: true  })
  refreshToken: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({
    type: 'enum',
    enum: KycStatus,
    default: KycStatus.NOT_COMPLETED,
  })
  KYC: KycStatus;
}

@Entity()
export class OTP {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  email: string;

  @Column()
  otp: string;

  @Column({ type: 'timestamp' })
  tokenExpiresIn: Date;

  @CreateDateColumn()
  createdAt: Date;

  constructor(email: string, token: string) {
    this.email = email;
    this.otp = token;
    this.tokenExpiresIn = new Date(Date.now() + 3600000); // Expires in 1 hour
  }
}
