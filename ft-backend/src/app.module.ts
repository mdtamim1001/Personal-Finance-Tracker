import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BudgetGoalModule } from './budget-goal/budget.module';
import { EmailService } from './email/email.service';
import { ExpenseModule } from './expense/expense.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'tamim',
      database: 'tamim',
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    BudgetGoalModule,
    ExpenseModule,
  ],
  providers: [EmailService],   // ✅ Make EmailService available globally
  exports: [EmailService],     // ✅ So other modules like AuthModule can use it
})
export class AppModule {}
