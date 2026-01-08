import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Trans from '../models/Transaction';


export const createTransaction = async (req: Request, res: Response) => {
    try {
        const { 
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
        
        await Trans.create({ 
            userId: new mongoose.Types.ObjectId(userId), 
            amount, 
            type, 
            category, 
            date, 
            description 
        });
        
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
        
        const transactions = await Trans.find({ userId: new mongoose.Types.ObjectId(userId) });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const deleteTransaction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Trans.findByIdAndDelete(id);
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const updateTransaction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { amount, type, category, date, description } = req.body;
        await Trans.findByIdAndUpdate(id, { amount, type, category, date, description });
        res.status(200).json({ message: 'Transaction updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}






