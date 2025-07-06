import { Schema } from 'mongoose';

export const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetOtp: { 
      code: { type: String },
      expiresAt: { type: Date },
    },
    budgets: [{ type: Schema.Types.ObjectId, ref: 'Budget' }],
    expense: [{ type: Schema.Types.ObjectId, ref: 'Expense' }],
  },
  {
    timestamps: true, // automatically handles createdAt & updatedAt
  }
);

export interface User {
  id(arg0: number, amount: number, id: any): unknown;
  _id?: string;
  email: string;
  password: string;
  resetOtp?: {
    code: string;
    expiresAt: Date;
  };
  budgets?: string[]; // Array of Budget IDs
  expense?: string[]; // Array of Expense IDs
}
