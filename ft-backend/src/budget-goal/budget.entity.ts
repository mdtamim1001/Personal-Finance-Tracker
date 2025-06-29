import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @Column('decimal')
  amount: number;

  @Column({
  type: 'date',
  transformer: {
    from: (value: string | Date) => new Date(value),
    to: (value: Date) => value,
  },
})
month: Date;

  @ManyToOne(() => User, (user) => user.budgets)
  user: User;
}

