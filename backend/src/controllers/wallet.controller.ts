import { Request, Response } from "express";

// Mock wallet data
const mockWallets = new Map([
  [1, { userId: 1, balance: 0, currency: "USD", status: "active" }],
  [2, { userId: 2, balance: 1125.5, currency: "USD", status: "active" }],
  [3, { userId: 3, balance: 45.75, currency: "USD", status: "active" }],
]);

const walletTransactions = new Map([
  [
    2,
    [
      {
        id: 1,
        type: "earning",
        amount: 50,
        currency: "USD",
        description: "Lesson with Student User",
        status: "completed",
        createdAt: "2024-02-15T14:00:00Z",
        relatedBookingId: 1,
      },
      {
        id: 2,
        type: "earning",
        amount: 75,
        currency: "USD",
        description: "Lesson with Student User",
        status: "completed",
        createdAt: "2024-02-14T15:00:00Z",
        relatedBookingId: 2,
      },
    ],
  ],
  [
    3,
    [
      {
        id: 3,
        type: "payment",
        amount: -25,
        currency: "USD",
        description: "Lesson payment to Teacher User",
        status: "completed",
        createdAt: "2024-02-15T14:00:00Z",
        relatedBookingId: 1,
      },
      {
        id: 4,
        type: "deposit",
        amount: 100,
        currency: "USD",
        description: "Wallet top-up via PayPal",
        status: "completed",
        createdAt: "2024-02-10T10:00:00Z",
        paymentMethodId: 1,
      },
    ],
  ],
]);

const payoutMethods = new Map([
  [
    2,
    [
      {
        id: 1,
        type: "paypal",
        email: "teacher@example.com",
        isDefault: true,
        status: "verified",
        minimumAmount: 10,
      },
      {
        id: 2,
        type: "bank_transfer",
        bankName: "Chase Bank",
        accountNumber: "****1234",
        routingNumber: "****5678",
        isDefault: false,
        status: "pending",
        minimumAmount: 100,
      },
    ],
  ],
]);

const payoutHistory = new Map([
  [
    2,
    [
      {
        id: 1,
        amount: 500,
        currency: "USD",
        method: "paypal",
        status: "completed",
        requestedAt: "2024-02-01T10:00:00Z",
        processedAt: "2024-02-02T14:30:00Z",
        fee: 15,
      },
    ],
  ],
]);

export const getMyWallet = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const wallet = mockWallets.get(userId);

    if (!wallet) {
      // Create wallet if it doesn't exist
      const newWallet = {
        userId,
        balance: 0,
        currency: "USD",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockWallets.set(userId, newWallet);

      return res.status(200).json({
        success: true,
        data: newWallet,
      });
    }

    return res.status(200).json({
      success: true,
      data: wallet,
    });
  } catch (error) {
    console.error("Get my wallet error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { page = 1, limit = 10, type, status } = req.query;

    let transactions = walletTransactions.get(userId) || [];

    // Filter by transaction type
    if (type && type !== "all") {
      transactions = transactions.filter((tx) => tx.type === type);
    }

    // Filter by status
    if (status && status !== "all") {
      transactions = transactions.filter((tx) => tx.status === status);
    }

    // Sort by date (newest first)
    transactions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    // Pagination
    const startIndex =
      (parseInt(page as string) - 1) * parseInt(limit as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedTransactions = transactions.slice(startIndex, endIndex);

    return res.status(200).json({
      success: true,
      data: paginatedTransactions,
      meta: {
        currentPage: parseInt(page as string),
        perPage: parseInt(limit as string),
        total: transactions.length,
        lastPage: Math.ceil(transactions.length / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addFunds = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { amount, paymentMethodId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const wallet = mockWallets.get(userId);
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    // Add funds to wallet
    wallet.balance += amount;

    // Add transaction record
    const transactions = walletTransactions.get(userId) || [];
    const newTransaction = {
      id: transactions.length + 1,
      type: "deposit",
      amount,
      currency: "USD",
      description: "Wallet top-up",
      status: "completed",
      createdAt: new Date().toISOString(),
      paymentMethodId,
    };
    transactions.push(newTransaction);
    walletTransactions.set(userId, transactions);

    return res.status(200).json({
      success: true,
      message: "Funds added successfully",
      data: {
        wallet,
        transaction: newTransaction,
      },
    });
  } catch (error) {
    console.error("Add funds error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const withdrawFunds = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { amount, reason } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const wallet = mockWallets.get(userId);
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Withdraw funds from wallet
    wallet.balance -= amount;

    // Add transaction record
    const transactions = walletTransactions.get(userId) || [];
    const newTransaction = {
      id: transactions.length + 1,
      type: "withdrawal",
      amount: -amount,
      currency: "USD",
      description: reason || "Wallet withdrawal",
      status: "completed",
      createdAt: new Date().toISOString(),
    };
    transactions.push(newTransaction);
    walletTransactions.set(userId, transactions);

    return res.status(200).json({
      success: true,
      message: "Withdrawal successful",
      data: {
        wallet,
        transaction: newTransaction,
      },
    });
  } catch (error) {
    console.error("Withdraw funds error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const transferFunds = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { recipientId, amount, note } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    if (recipientId === userId) {
      return res.status(400).json({ message: "Cannot transfer to yourself" });
    }

    const senderWallet = mockWallets.get(userId);
    const recipientWallet = mockWallets.get(recipientId);

    if (!senderWallet || !recipientWallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (senderWallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Transfer funds
    senderWallet.balance -= amount;
    recipientWallet.balance += amount;

    // Add transaction records
    const senderTransactions = walletTransactions.get(userId) || [];
    const recipientTransactions = walletTransactions.get(recipientId) || [];

    const transferOut = {
      id: senderTransactions.length + 1,
      type: "transfer_out",
      amount: -amount,
      currency: "USD",
      description: `Transfer to user ${recipientId}${note ? ": " + note : ""}`,
      status: "completed",
      createdAt: new Date().toISOString(),
      recipientId,
    };

    const transferIn = {
      id: recipientTransactions.length + 1,
      type: "transfer_in",
      amount,
      currency: "USD",
      description: `Transfer from user ${userId}${note ? ": " + note : ""}`,
      status: "completed",
      createdAt: new Date().toISOString(),
      senderId: userId,
    };

    senderTransactions.push(transferOut);
    recipientTransactions.push(transferIn);
    walletTransactions.set(userId, senderTransactions);
    walletTransactions.set(recipientId, recipientTransactions);

    return res.status(200).json({
      success: true,
      message: "Transfer successful",
      data: {
        senderWallet,
        transaction: transferOut,
      },
    });
  } catch (error) {
    console.error("Transfer funds error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPayoutMethods = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const methods = payoutMethods.get(userId) || [];

    return res.status(200).json({
      success: true,
      data: methods,
    });
  } catch (error) {
    console.error("Get payout methods error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addPayoutMethod = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { type, ...methodData } = req.body;

    if (!type || !["paypal", "bank_transfer"].includes(type)) {
      return res.status(400).json({ message: "Invalid payout method type" });
    }

    const methods = payoutMethods.get(userId) || [];
    const newMethod = {
      id: methods.length + 1,
      type,
      ...methodData,
      isDefault: methods.length === 0, // First method is default
      status: "pending",
      minimumAmount: type === "paypal" ? 10 : 100,
      createdAt: new Date().toISOString(),
    };

    methods.push(newMethod);
    payoutMethods.set(userId, methods);

    return res.status(201).json({
      success: true,
      message: "Payout method added successfully",
      data: newMethod,
    });
  } catch (error) {
    console.error("Add payout method error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const requestPayout = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { amount, payoutMethodId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const wallet = mockWallets.get(userId);
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const methods = payoutMethods.get(userId) || [];
    const payoutMethod = methods.find((m) => m.id === payoutMethodId);

    if (!payoutMethod) {
      return res.status(404).json({ message: "Payout method not found" });
    }

    if (amount < payoutMethod.minimumAmount) {
      return res.status(400).json({
        message: `Minimum payout amount is $${payoutMethod.minimumAmount}`,
      });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Calculate fee (2% for PayPal, $5 for bank transfer)
    const fee = payoutMethod.type === "paypal" ? amount * 0.02 : 5;
    const netAmount = amount - fee;

    // Create payout request
    const history = payoutHistory.get(userId) || [];
    const payoutRequest = {
      id: history.length + 1,
      amount: netAmount,
      currency: "USD",
      method: payoutMethod.type,
      status: "pending",
      requestedAt: new Date().toISOString(),
      processedAt: null,
      fee,
      grossAmount: amount,
    };

    history.push(payoutRequest);
    payoutHistory.set(userId, history);

    // Reserve funds (in real app, would deduct after processing)
    wallet.balance -= amount;

    return res.status(200).json({
      success: true,
      message: "Payout request submitted successfully",
      data: payoutRequest,
    });
  } catch (error) {
    console.error("Request payout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPayoutHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { page = 1, limit = 10, status } = req.query;

    let history = payoutHistory.get(userId) || [];

    // Filter by status
    if (status && status !== "all") {
      history = history.filter((payout) => payout.status === status);
    }

    // Sort by date (newest first)
    history.sort(
      (a, b) =>
        new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime(),
    );

    // Pagination
    const startIndex =
      (parseInt(page as string) - 1) * parseInt(limit as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedHistory = history.slice(startIndex, endIndex);

    return res.status(200).json({
      success: true,
      data: paginatedHistory,
      meta: {
        currentPage: parseInt(page as string),
        perPage: parseInt(limit as string),
        total: history.length,
        lastPage: Math.ceil(history.length / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error("Get payout history error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
