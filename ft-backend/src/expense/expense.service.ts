import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './expense.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
  ) {}

  async addExpense(
    expense_name: string,
    amount: number,
    date: Date,
    category: string,
    user: User,
  ) {
    const expense = this.expenseRepository.create({
      expense_name,
      amount,
      date,
      category,
      user,
    });

    return this.expenseRepository.save(expense);
  }

  async getUserExpenses(userId: number) {
    return this.expenseRepository.find({
      where: { user: { id: userId } },
      order: { date: 'DESC' },
    });
  }
}
