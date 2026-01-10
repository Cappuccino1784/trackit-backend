import { Request, Response } from 'express';
import CurrencyRate from '../models/CurrencyRate';
import { fetchCurrencyRates } from '../utils/currencies';

// Get today's currency rates (fetch from DB or API if needed)
export const getCurrencyRates = async (req: Request, res: Response) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of day

        // Check if we have today's rates in the database
        let currencyRate = await CurrencyRate.findOne({ date: today });

        if (!currencyRate) {
            // Fetch new rates from API
            try {
                const rates = await fetchCurrencyRates();
                
                // Save to database
                currencyRate = new CurrencyRate({
                    date: today,
                    baseCurrency: 'USD',
                    rates: rates,
                });
                await currencyRate.save();
            } catch (apiError) {
                console.error('Failed to fetch currency rates from API:', apiError);
                
                // Fallback to most recent rates if API fails
                currencyRate = await CurrencyRate.findOne().sort({ date: -1 });
                
                if (!currencyRate) {
                    return res.status(503).json({ 
                        message: 'Currency rates service unavailable' 
                    });
                }
            }
        }

        // Convert Map to Object for JSON response
        const ratesObject = Object.fromEntries(currencyRate.rates);

        res.status(200).json({
            date: currencyRate.date,
            baseCurrency: currencyRate.baseCurrency,
            rates: ratesObject,
        });
    } catch (error) {
        console.error('Error getting currency rates:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Convert amount from one currency to another
export const convertCurrency = async (req: Request, res: Response) => {
    try {
        const { amount, fromCurrency, toCurrency } = req.query;

        if (!amount || !fromCurrency || !toCurrency) {
            return res.status(400).json({ 
                message: 'Missing required parameters: amount, fromCurrency, toCurrency' 
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get today's rates (or most recent)
        let currencyRate = await CurrencyRate.findOne({ date: today });
        
        if (!currencyRate) {
            currencyRate = await CurrencyRate.findOne().sort({ date: -1 });
        }

        if (!currencyRate) {
            return res.status(404).json({ 
                message: 'No currency rates available' 
            });
        }

        const fromRate = currencyRate.rates.get(fromCurrency as string) || 1;
        const toRate = currencyRate.rates.get(toCurrency as string) || 1;

        // Convert: amount in fromCurrency -> USD -> toCurrency
        const amountInUSD = parseFloat(amount as string) / fromRate;
        const convertedAmount = amountInUSD * toRate;

        res.status(200).json({
            originalAmount: parseFloat(amount as string),
            fromCurrency,
            toCurrency,
            convertedAmount,
            rate: toRate / fromRate,
        });
    } catch (error) {
        console.error('Error converting currency:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get list of supported currencies
export const getSupportedCurrencies = async (req: Request, res: Response) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get today's rates (or most recent)
        let currencyRate = await CurrencyRate.findOne({ date: today });
        
        if (!currencyRate) {
            currencyRate = await CurrencyRate.findOne().sort({ date: -1 });
        }

        if (!currencyRate) {
            // Return common currencies as fallback
            return res.status(200).json({
                currencies: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR']
            });
        }

        const currencies = Array.from(currencyRate.rates.keys());

        res.status(200).json({
            currencies: currencies.sort(),
            count: currencies.length,
        });
    } catch (error) {
        console.error('Error getting supported currencies:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Manually refresh currency rates (admin function)
export const refreshCurrencyRates = async (req: Request, res: Response) => {
    try {
        const rates = await fetchCurrencyRates();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Update or create today's rates
        const currencyRate = await CurrencyRate.findOneAndUpdate(
            { date: today },
            {
                date: today,
                baseCurrency: 'USD',
                rates: rates,
            },
            { upsert: true, new: true }
        );

        const ratesObject = Object.fromEntries(currencyRate.rates);

        res.status(200).json({
            message: 'Currency rates refreshed successfully',
            date: currencyRate.date,
            baseCurrency: currencyRate.baseCurrency,
            rates: ratesObject,
        });
    } catch (error) {
        console.error('Error refreshing currency rates:', error);
        res.status(500).json({ 
            message: 'Failed to refresh currency rates',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
