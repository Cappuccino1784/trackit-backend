import mongoose, { Document } from 'mongoose';

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: Date;
    description?: string;
}

const transactionSchema = new mongoose.Schema<ITransaction>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
    },
});
const Trans = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Trans;