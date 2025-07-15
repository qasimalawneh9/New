import { Request, Response } from 'express';
import Wallet from '../models/wallets.model';

export const getMyWallet = async (req: Request, res: Response) => {
  try {
    const wallet = await Wallet.findOne({ where: { userId: req.user.id } });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch wallet' });
  }
};
