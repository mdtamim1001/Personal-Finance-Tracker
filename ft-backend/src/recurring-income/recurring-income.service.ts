// recurring-income.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecurringIncome } from './recurring-income.entity';

@Injectable()
export class RecurringIncomeService {
  constructor(
    @InjectRepository(RecurringIncome)  // This tells NestJS to inject the repository
    private recurringIncomeRepository: Repository<RecurringIncome>,
  ) {}

  // Example method to create recurring income
  async create(recurringIncomeData: Partial<RecurringIncome>): Promise<RecurringIncome> {
    const recurringIncome = this.recurringIncomeRepository.create(recurringIncomeData);
    return await this.recurringIncomeRepository.save(recurringIncome);
  }

  // Example method to get all recurring incomes
  async findAll(): Promise<RecurringIncome[]> {
    return await this.recurringIncomeRepository.find();
  }
}
