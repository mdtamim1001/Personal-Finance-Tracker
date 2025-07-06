import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { budget } from './budget.model';

@Injectable()
export class BudgetService {
    constructor(
        @InjectModel('Budget') private readonly budgetModel: Model<budget> // Replace 'any' with your actual Budget model type
    ) {}

    async createBudget(budgetData: budget): Promise<budget> {
        const newBudget = new this.budgetModel(budgetData);
        return await newBudget.save();
    }
    async getBudgets(): Promise<budget[]> {
        return await this.budgetModel.find().exec();
    }
    async getBudgetById(id: string): Promise<budget | null> {
        return await this.budgetModel.findById(id).exec();
    }

    async updateBudget(id: string, amount: number, userId: string) {
    const budget = await this.budgetModel.findOne({
      where: { id, user: { id: userId } },
    });

    if (!budget) throw new Error('Budget not found');

    budget.amount = amount;
    return await budget.save();
  }

    async deleteBudget(id: string): Promise<budget | null> {
        return await this.budgetModel.findByIdAndDelete(id).exec();
    }
    async getBudgetsByUserId(userId: string): Promise<budget[]> {
        return await this.budgetModel.find({ userId }).exec();
    }

}
