import Router from 'express'
import { getAllAccounts, createAccount, updateAccount, deleteAccount, getAccountById, getAccountBalance, transferBetweenAccounts, getAccountTransactions } from '../controllers/accounts.controllers'
import { authMiddleware } from '../middlewares/auth.middleware'

const accRouter = Router()

// All routes require authentication
accRouter.use(authMiddleware)

// Get All Accounts
accRouter.get('/get-accounts', getAllAccounts)

// Create Account
accRouter.post('/create-account', createAccount)

// Update Account
accRouter.put('/update-account/:id', updateAccount)

// Delete Account
accRouter.delete('/delete-account/:id', deleteAccount)

// Get Account by ID
accRouter.get('/get-account/:id', getAccountById)

// Get Account Balance
accRouter.get('/get-account-balance/:id', getAccountBalance)

// Transfer Between Accounts
accRouter.post('/transfer', transferBetweenAccounts)

// Get Account Transactions
accRouter.get('/get-account-transactions/:id', getAccountTransactions)



export default accRouter



