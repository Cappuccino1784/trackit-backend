import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Trans from '../models/Transaction';
import Account from '../models/Account';


export const createTransaction = async (req: Request, res: Response) => {
    try {
        const { 
            accountId,
            toAccountId,
            amount, 
            type,
            category,
            date, 
            description 
        } = req.body;
        
        const userId = req.userId; // From auth middleware
        
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        
        if (!accountId) {
            return res.status(400).json({ message: 'Account is required' });
        }
        
        if (type === 'transfer' && !toAccountId) {
            return res.status(400).json({ message: 'Receiving account is required for transfers' });
        }
        
        // Create transaction
        await Trans.create({ 
            userId: new mongoose.Types.ObjectId(userId),
            accountId: new mongoose.Types.ObjectId(accountId),
            toAccountId: toAccountId ? new mongoose.Types.ObjectId(toAccountId) : undefined,
            amount, 
            type, 
            category, 
            date, 
            description 
        });
        
        // Update account balance
        if (type === 'transfer') {
            // Deduct from source account
            await Account.findByIdAndUpdate(
                accountId,
                { $inc: { balance: -amount } }
            );
            // Add to destination account
            await Account.findByIdAndUpdate(
                toAccountId,
                { $inc: { balance: amount } }
            );
        } else {
            const balanceChange = type === 'income' ? amount : -amount;
            await Account.findByIdAndUpdate(
                accountId,
                { $inc: { balance: balanceChange } }
            );
        }
        
        res.status(201).json({ message: 'Transaction created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const getTransactions = async (req: Request, res: Response) => {
    try {
        const userId = req.userId; // From auth middleware
        
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        
        const transactions = await Trans.find({ userId: new mongoose.Types.ObjectId(userId) })
            .populate('accountId', 'name')
            .populate('toAccountId', 'name')
            .sort({ date: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const deleteTransaction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Get transaction before deleting to reverse balance
        const transaction = await Trans.findById(id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        
        // Reverse the balance change
        if (transaction.type === 'transfer') {
            // Reverse transfer: add back to source, remove from destination
            await Account.findByIdAndUpdate(
                transaction.accountId,
                { $inc: { balance: transaction.amount } }
            );
            if (transaction.toAccountId) {
                await Account.findByIdAndUpdate(
                    transaction.toAccountId,
                    { $inc: { balance: -transaction.amount } }
                );
            }
        } else {
            const balanceChange = transaction.type === 'income' ? -transaction.amount : transaction.amount;
            await Account.findByIdAndUpdate(
                transaction.accountId,
                { $inc: { balance: balanceChange } }
            );
        }
        
        // Delete transaction
        await Trans.findByIdAndDelete(id);
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const updateTransaction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { accountId, toAccountId, amount, type, category, date, description } = req.body;
        
        // Get old transaction to reverse its balance effect
        const oldTransaction = await Trans.findById(id);
        if (!oldTransaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        
        // Reverse old transaction's balance effect
        if (oldTransaction.type === 'transfer') {
            await Account.findByIdAndUpdate(
                oldTransaction.accountId,
                { $inc: { balance: oldTransaction.amount } }
            );
            if (oldTransaction.toAccountId) {
                await Account.findByIdAndUpdate(
                    oldTransaction.toAccountId,
                    { $inc: { balance: -oldTransaction.amount } }
                );
            }
        } else {
            const oldBalanceChange = oldTransaction.type === 'income' ? -oldTransaction.amount : oldTransaction.amount;
            await Account.findByIdAndUpdate(
                oldTransaction.accountId,
                { $inc: { balance: oldBalanceChange } }
            );
        }
        
        // Apply new transaction's balance effect
        if (type === 'transfer') {
            await Account.findByIdAndUpdate(
                accountId,
                { $inc: { balance: -amount } }
            );
            if (toAccountId) {
                await Account.findByIdAndUpdate(
                    toAccountId,
                    { $inc: { balance: amount } }
                );
            }
        } else {
            const newBalanceChange = type === 'income' ? amount : -amount;
            await Account.findByIdAndUpdate(
                accountId,
                { $inc: { balance: newBalanceChange } }
            );
        }
        
        // Update transaction
        await Trans.findByIdAndUpdate(id, { accountId, toAccountId, amount, type, category, date, description });
        res.status(200).json({ message: 'Transaction updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}






