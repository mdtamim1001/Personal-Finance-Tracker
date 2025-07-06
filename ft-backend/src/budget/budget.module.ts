import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { budgetSchema } from './budget.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Budget', schema: budgetSchema }]),
  ],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
