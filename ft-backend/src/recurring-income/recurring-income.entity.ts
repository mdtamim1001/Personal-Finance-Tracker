import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class RecurringIncome {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  source: string;  

  @Column()
  amount: number;

  @Column()
  frequency: string; 

  @Column({ type: 'timestamp' })
  date: string;

  @ManyToOne(() => User, (user) => user.expense)
  user: User;
}
