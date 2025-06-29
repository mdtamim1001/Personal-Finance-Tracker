import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BudgetGoalModule } from './budget-goal/budget.module';
import { EmailService } from './email/email.service';
import { ExpenseModule } from './expense/expense.module';
import { RecurringIncomeModule } from './recurring-income/recurring-income.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'tamim',
      database: 'tamimdb',
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    BudgetGoalModule,
    ExpenseModule,
    RecurringIncomeModule,
  ],
  providers: [EmailService],   // ✅ Make EmailService available globally
  exports: [EmailService],     // ✅ So other modules like AuthModule can use it
})
export class AppModule {}
