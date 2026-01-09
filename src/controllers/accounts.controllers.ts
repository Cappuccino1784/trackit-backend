import { Request, Response } from 'express';
import Account from '../models/Account';

export const getAllAccounts = async (req: Request, res: Response) => {
    try {
        const userId = req.userId; // From auth middleware
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const accounts = await Account.find({ userId: userId });
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}


export const createAccount = async (req: Request, res: Response) => {
    try {
        const { name, balance } = req.body;
        const userId = req.userId; // From auth middleware
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const newAccount = new Account({
            userId: userId,
            name,
            balance
        });
        await newAccount.save();
        res.status(201).json(newAccount);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }

}


export const updateAccount = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, balance } = req.body;
        const userId = req.userId; // From auth middleware
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const account = await Account.findOneAndUpdate(
            { _id: id, userId: userId },
            { name, balance },
            { new: true }
        );
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.status(200).json(account);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}


export const deleteAccount = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId; // From auth middleware
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const account = await Account.findOneAndDelete({ _id: id, userId: userId });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const getAccountById = async (req: Request, res: Response) => {
    // Logic to get account by ID
    res.send({ message: 'Get account by ID' });
}

export const getAccountBalance = async (req: Request, res: Response) => {
    // Logic to get account balance
    res.send({ message: 'Get account balance' });
}

export const transferBetweenAccounts = async (req: Request, res: Response) => {
    // Logic to transfer between accounts
    res.send({ message: 'Transfer between accounts' });
}

export const getAccountTransactions = async (req: Request, res: Response) => {
    // Logic to get transactions for a specific account
    res.send({ message: 'Get account transactions' });
}



