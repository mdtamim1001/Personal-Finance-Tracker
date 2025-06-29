import { IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateRecurringIncomeDto {
  @IsString()
  source: string;

  @IsNumber()
  amount: number;

  @IsString()
  frequency: string; // like "Monthly", "Yearly"

  @IsDateString()
  nextPaymentDate: Date;
}
