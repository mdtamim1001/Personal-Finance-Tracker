import { Schema } from 'mongoose';

export const budgetSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['monthly', 'weekly', 'yearly']
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },

        date: {
            type: Date,
            required: true,
            default: Date.now
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: true}

    },
    {
        timestamps: true, 
    }
);

export interface budget {
    _id?: string;
    name: string;
    type: 'monthly' | 'weekly' | 'yearly';
    amount: number;
    date: Date;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number; 

}
