import mongoose, { Document } from "mongoose";

export interface ICurrencyRate extends Document {
    date: Date;
    baseCurrency: string;
    rates: Map<string, number>;
    createdAt: Date;
}

const currencyRateSchema = new mongoose.Schema<ICurrencyRate>({
    date: {
        type: Date,
        required: true,
        unique: true,
    },
    baseCurrency: {
        type: String,
        required: true,
        default: 'USD',
    },
    rates: {
        type: Map,
        of: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create index on date for faster lookups
currencyRateSchema.index({ date: -1 });

const CurrencyRate = mongoose.model<ICurrencyRate>('CurrencyRate', currencyRateSchema);

export default CurrencyRate;
