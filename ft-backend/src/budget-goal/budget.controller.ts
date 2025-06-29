import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/user.entity';
import { Response } from 'express';

@Controller('budget')
@UseGuards(JwtAuthGuard)
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  // ✅ Set a category budget for a specific month
  @Post()
  async setCategoryBudget(
    @Body() body: { category: string; amount: number; month: string }, // e.g. { month: "2024-07" }
    @GetUser() user: User,
  ) {
    const { category, amount, month } = body;
    return this.budgetService.setCategoryBudget(category, amount, month, user);
  }

  // ✅ Get all budgets (for all months) for user
  @Get()
  async getUserBudgets(@GetUser() user: User) {
    return this.budgetService.getUserBudgets(user.id);
  }

  @Patch(':id')
  async updateBudget(
    @Param('id') id: string,
    @Body() body: { amount: number },
    @GetUser() user: User,
  ) {
    return this.budgetService.updateBudget(+id, body.amount, user.id);
  }

  @Delete(':id')
  async deleteBudget(@Param('id') id: string, @GetUser() user: User) {
    return this.budgetService.deleteBudget(+id, user.id);
  }

  // ✅ Category + month summary report
  @Get('summary')
  getSummary(@GetUser() user: User) {
    return this.budgetService.getBudgetSummary(user.id);
  }

  // ✅ Download summary as .txt file
  @Get('summary/download-txt')
  async downloadBudgetSummaryTxt(@GetUser() user: User, @Res() res: Response) {
    const summaryText = await this.budgetService.getBudgetSummaryTxt(user.id);
    res.header('Content-Type', 'text/plain');
    res.attachment('budget-summary.txt');
    return res.send(summaryText);
  }

  // ✅ Monthly trend for line chart
  @Get('trend')
  getMonthlyTrend(@GetUser() user: User) {
    return this.budgetService.getMonthlyBudgetTrend(user.id);
  }
}
