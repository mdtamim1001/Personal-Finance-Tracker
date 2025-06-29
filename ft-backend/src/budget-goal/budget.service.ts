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

  // ✅ Set or update category budget for a given month
  async setCategoryBudget(category: string, amount: number, month: string, user: User) {
    const parsedMonth = new Date(`${month}-01`); // e.g., '2024-07'
    
    let budget = await this.budgetRepository.findOne({
      where: { category, user: { id: user.id }, month: parsedMonth },
    });

    if (budget) {
      budget.amount = amount;
    } else {
      budget = this.budgetRepository.create({
        category,
        amount,
        month: parsedMonth,
        user,
      });
    }

    return this.budgetRepository.save(budget);
  }

  // ✅ Get all budgets for a user (across months)
  async getUserBudgets(userId: number) {
    return this.budgetRepository.find({
      where: { user: { id: userId } },
    });
  }

  async updateBudget(id: number, amount: number, userId: number) {
    const budget = await this.budgetRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!budget) throw new Error('Budget not found');

    budget.amount = amount;
    return this.budgetRepository.save(budget);
  }

  async deleteBudget(id: number, userId: number) {
    const budget = await this.budgetRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!budget) throw new Error('Budget not found');

    return this.budgetRepository.remove(budget);
  }

  // ✅ Grouped summary: category-wise for current month
  async getBudgetSummary(userId: number) {
    const budgets = await this.budgetRepository.find({ where: { user: { id: userId } } });
    const expenses = await this.expenseRepository.find({ where: { user: { id: userId } } });

    const summary = budgets.map((budget) => {
      const totalSpent = expenses
        .filter(
          (e) =>
            e.category === budget.category &&
            new Date(e.date).toISOString().slice(0, 7) === budget.month.toISOString().slice(0, 7)
        )
        .reduce((sum, e) => sum + Number(e.amount), 0);

      return {
        category: budget.category,
        month: new Date(budget.month).toISOString().slice(0, 7), // safely extract 'YYYY-MM'
        budgeted: Number(budget.amount),
        spent: totalSpent,
        percentage: Number(budget.amount) > 0 ? (totalSpent / Number(budget.amount)) * 100 : 0,
      };
    });

    return summary;
  }

  // ✅ Generate summary in plain text format
  async getBudgetSummaryTxt(userId: number): Promise<string> {
    const budgets = await this.budgetRepository.find({ where: { user: { id: userId } } });
    const expenses = await this.expenseRepository.find({ where: { user: { id: userId } } });

    let text = 'Month\t\tCategory\t\tBudgeted\tSpent\tRemaining\t% Used\n';
    text += '--------------------------------------------------------------------------\n';

    budgets.forEach((budget) => {
      const monthKey = new Date(budget.month).toISOString().slice(0, 7);
      const totalSpent = expenses
        .filter(
          (e) =>
            e.category === budget.category &&
            new Date(e.date).toISOString().slice(0, 7) === monthKey
        )
        .reduce((sum, e) => sum + Number(e.amount), 0);

      const budgetedAmount = Number(budget.amount);
      const remaining = budgetedAmount - totalSpent;
      const percentage =
        budgetedAmount > 0 ? ((totalSpent / budgetedAmount) * 100).toFixed(2) : '0.00';

      text += `${monthKey}\t\t${budget.category}\t\t${budgetedAmount}\t\t${totalSpent}\t\t${remaining}\t\t${percentage}%\n`;
    });

    return text;
  }

  // ✅ (Optional) Monthly trend for line chart
  async getMonthlyBudgetTrend(userId: number) {
    const budgets = await this.budgetRepository.find({ where: { user: { id: userId } } });
    const expenses = await this.expenseRepository.find({ where: { user: { id: userId } } });

    const trend: { [month: string]: { budgeted: number; spent: number } } = {};

    budgets.forEach((b) => {
      const key = b.month.toISOString().slice(0, 7); // '2024-07'
      if (!trend[key]) trend[key] = { budgeted: 0, spent: 0 };
      trend[key].budgeted += Number(b.amount);
    });

    expenses.forEach((e) => {
      const key = new Date(e.date).toISOString().slice(0, 7);
      if (!trend[key]) trend[key] = { budgeted: 0, spent: 0 };
      trend[key].spent += Number(e.amount);
    });

    return Object.entries(trend)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, values]) => ({
        month,
        ...values,
      }));
  }
}
