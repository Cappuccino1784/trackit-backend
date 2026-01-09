import mongoose, { Document } from "mongoose";

export interface IAccount extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    balance: number;
    currency: string;
}

const accountSchema = new mongoose.Schema<IAccount>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
    },
    currency: {
        type: String,
        required: true,
        default: 'USD',
    },
});

const Account = mongoose.model<IAccount>('Account', accountSchema);

export default Account;