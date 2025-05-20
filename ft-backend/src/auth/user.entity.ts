import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Budget } from '../budget-goal/budget.entity';
import { Expense } from '../expense/expense.entity';

export interface ResetOtp {
  code: string;
  expiresAt: Date;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 👇 new unified field for OTP & expiry
  @Column({ type: 'jsonb', nullable: true })
  resetOtp: ResetOtp | null;

  @OneToMany(() => Budget, (budget) => budget.user)
  budgets: Budget[];
  
  @OneToMany(() => Expense, (expense) => expense.user)
  expense: Expense[];
}

