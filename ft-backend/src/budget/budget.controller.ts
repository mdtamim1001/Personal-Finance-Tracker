import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post('create')
  async createBudget(@Body() budgetData: any) {
    return this.budgetService.createBudget(budgetData);
  }

  @Get('getAll')
  async getBudgets() {
    return this.budgetService.getBudgets();}

  @Get('getById/:id') // Now matches: GET /budget/686a01102ce71c0e4bac7651
  async getBudgetById(@Param('id') id: string) {
    return this.budgetService.getBudgetById(id);
  }

  @Delete('delete/:id')
  async deleteBudget(@Param('id') id: string) {
    return this.budgetService.deleteBudget(id);
  }
  @Post('getByUserId')
  async getBudgetsByUserId(@Body('userId') userId: string) {
    return this.budgetService.getBudgetsByUserId(userId);
  }

  @Patch('update/:id')
  async updateBudget(
    @Param('id') id: string,
    @Body() body: { amount: number },
    @GetUser() user: User,
  ) {
    return this.budgetService.updateBudget(id, body.amount, user?.id as unknown as string);
  }

}

