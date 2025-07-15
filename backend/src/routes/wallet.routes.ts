import express from 'express';
import { getMyWallet } from '../controllers/wallet.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/me', authenticate, getMyWallet);

export default router;
