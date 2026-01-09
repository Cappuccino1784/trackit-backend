import mongoose, { Document } from 'mongoose';

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    accountId: mongoose.Types.ObjectId;
    toAccountId?: mongoose.Types.ObjectId;
    amount: number;
    type: 'income' | 'expense' | 'transfer';
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
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
    },
    toAccountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: false,
    },
    amount: {
        type: Number,
        required: true,
        max: 1000000000,
    },
    type: {
        type: String,
        enum: ['income', 'expense', 'transfer'],
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
        maxlength: 500,
    },
});
const Trans = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Trans;