import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { EmailService } from './email/email.service';
import { BudgetModule } from './budget/budget.module';

console.log('MONGO_URI:', process.env.MONGO_URI);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI ?? ''), // 💡 uses .env
    AuthModule, BudgetModule,
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class AppModule {}
