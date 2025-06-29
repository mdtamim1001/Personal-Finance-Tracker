import { Controller, Get, Post, Body } from '@nestjs/common';
import { RecurringIncomeService } from './recurring-income.service';
import { CreateRecurringIncomeDto } from './recurring-income.dto';
import { RecurringIncome } from './recurring-income.entity';

@Controller('recurring-income')
export class RecurringIncomeController {
  constructor(private readonly recurringIncomeService: RecurringIncomeService) {}

  @Post()
  create(@Body() createDto: CreateRecurringIncomeDto): Promise<RecurringIncome> {
    return this.recurringIncomeService.create(createDto);
  }

  @Get()
  findAll(): Promise<RecurringIncome[]> {
    return this.recurringIncomeService.findAll();
  }
}
