import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('expense')
@UseGuards(JwtAuthGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post('add')
  async addExpense(
    @Body() body: { expense_name: string; amount: number; date: Date; category: string },
    @GetUser() user: User,
  ) {
    const { expense_name, amount, date, category } = body;
    return this.expenseService.addExpense(expense_name, amount, date, category, user);
  }

  @Get('get')
  async getUserExpenses(@GetUser() user: User) {
    return this.expenseService.getUserExpenses(user.id);
  }
}
