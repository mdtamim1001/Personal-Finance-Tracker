import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Budget } from './budget.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { Expense } from 'src/expense/expense.entity';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
  ) {}

  // Create or update a category budget
  async setCategoryBudget(category: string, amount: number, user: User) {
    let budget = await this.budgetRepository.findOne({
      where: { category, user: { id: user.id } },
    });

    if (budget) {
      budget.amount = amount;
    } else {
      budget = this.budgetRepository.create({
        category,
        amount,
        user,
      });
    }

    return this.budgetRepository.save(budget);
  }

  // Get all budgets for a user
  async getUserBudgets(userId: number) {
    return this.budgetRepository.find({
      where: { user: { id: userId } },
    });
  }

  // Update specific budget
  async updateBudget(id: number, amount: number, userId: number) {
    const budget = await this.budgetRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!budget) {
      throw new Error('Budget not found');
    }

    budget.amount = amount;
    return this.budgetRepository.save(budget);
  }

  // Delete specific budget
  async deleteBudget(id: number, userId: number) {
    const budget = await this.budgetRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!budget) {
      throw new Error('Budget not found');
    }

    return this.budgetRepository.remove(budget);
  }

  // report.service.ts
async getBudgetSummary(userId: number) {
  const budgets = await this.budgetRepository.find({ where: { user: { id: userId } } });
  const expenses = await this.expenseRepository.find({ where: { user: { id: userId } } });

  const summary = budgets.map((budget) => {
    const totalSpent = expenses
      .filter((e) => e.category === budget.category)
      .reduce((sum, e) => sum + Number(e.amount), 0);

    return {
      category: budget.category,
      budgeted: Number(budget.amount),
      spent: totalSpent,
      percentage: totalSpent/Number(budget.amount)*100,
    };
  });

  return summary;
}

async getBudgetSummaryTxt(userId: number): Promise<string> {
  const budgets = await this.budgetRepository.find({ where: { user: { id: userId } } });
  const expenses = await this.expenseRepository.find({ where: { user: { id: userId } } });

  let text = 'Category\t\t\tBudgeted\t\tSpent\t\tRemaining\t\tPercentage\n';
  text += '--------------------------------------------------------------------------\n';

  budgets.forEach((budget) => {
    const totalSpent = expenses
      .filter((e) => e.category === budget.category)
      .reduce((sum, e) => sum + Number(e.amount), 0);

    const budgetedAmount = Number(budget.amount);
    const remaining = budgetedAmount - totalSpent;
    const percentage = budgetedAmount > 0 ? ((totalSpent / budgetedAmount) * 100).toFixed(2) : '0.00';

    text += `${budget.category}\t\t\t\t${budgetedAmount}\t\t\t${totalSpent}\t\t\t${remaining}\t\t\t${percentage}%\n`;
  });

  return text;
}


}
