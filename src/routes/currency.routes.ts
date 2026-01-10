import { Router } from 'express';
import { 
    getCurrencyRates, 
    convertCurrency, 
    getSupportedCurrencies,
    refreshCurrencyRates 
} from '../controllers/currency.controllers';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Get current currency rates (cached in DB, fetched once per day)
router.get('/get-rates', authMiddleware, getCurrencyRates);

// Convert amount between currencies
router.get('/convert', authMiddleware, convertCurrency);

// Get list of supported currencies
router.get('/supported', authMiddleware, getSupportedCurrencies);

// Manually refresh rates (can be restricted to admin users)
router.post('/refresh', authMiddleware, refreshCurrencyRates);

export default router;
