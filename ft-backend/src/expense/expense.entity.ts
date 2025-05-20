import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  expense_name: string;

  @Column('decimal')
  amount: number;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  category: string;

  @ManyToOne(() => User, (user) => user.expense)
  user: User;
}
