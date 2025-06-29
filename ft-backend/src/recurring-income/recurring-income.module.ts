// recurring-income.module.ts
import { Module } from '@nestjs/common';
import { RecurringIncomeService } from './recurring-income.service';
import { RecurringIncomeController } from './recurring-income.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecurringIncome } from './recurring-income.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecurringIncome])],  // Register the repository here
  providers: [RecurringIncomeService],
  controllers: [RecurringIncomeController],
})
export class RecurringIncomeModule {}
