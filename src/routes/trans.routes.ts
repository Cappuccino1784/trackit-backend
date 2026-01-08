import Router from 'express';
import { createTransaction, getTransactions, deleteTransaction, updateTransaction } from '../controllers/trans.controllers';
import { authMiddleware } from '../middlewares/auth.middleware';

const transRouter = Router();

// All routes require authentication
transRouter.use(authMiddleware);

// Create Transaction
transRouter.post('/', createTransaction);

// Get Transactions for authenticated user
transRouter.get('/', getTransactions);

// Delete Transaction by ID
transRouter.delete('/:id', deleteTransaction);

// Update Transaction by ID
transRouter.put('/:id', updateTransaction);

export default transRouter;