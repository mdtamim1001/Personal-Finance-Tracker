import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService],  // 👈 make it usable outside
})
export class EmailModule {}
