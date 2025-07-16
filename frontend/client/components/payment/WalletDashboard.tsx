import React, { useState } from "react";
import {
  Wallet,
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Filter,
  Download,
  Eye,
  EyeOff,
  Banknote,
  PiggyBank,
  Target,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
import { useAuth } from "../../contexts/AuthContext";
import { PLATFORM_CONFIG } from "../../api/config";
import { WalletTransaction, PayoutRequest } from "../../types/platform";
import { format, parseISO, subDays, startOfMonth, endOfMonth } from "date-fns";
import { cn } from "../../lib/utils";

interface WalletData {
  balance: number;
  currency: string;
  totalEarnings: number;
  totalSpent: number;
  pendingPayouts: number;
  monthlySpending: number;
  monthlyEarnings: number;
  transactions: WalletTransaction[];
  payouts: PayoutRequest[];
}

interface WalletDashboardProps {
  walletData: WalletData;
  userRole: "student" | "teacher";
  onAddFunds: (amount: number, method: string) => void;
  onWithdraw: (amount: number, method: string) => void;
  onRequestPayout: (amount: number, method: string) => void;
  className?: string;
}

interface AddFundsData {
  amount: number;
  paymentMethod: string;
}

interface WithdrawData {
  amount: number;
  withdrawMethod: string;
  accountDetails: Record<string, string>;
}

export function WalletDashboard({
  walletData,
  userRole,
  onAddFunds,
  onWithdraw,
  onRequestPayout,
  className,
}: WalletDashboardProps) {
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [transactionFilter, setTransactionFilter] = useState("all");

  const [addFundsData, setAddFundsData] = useState<AddFundsData>({
    amount: 0,
    paymentMethod: "stripe",
  });

  const [withdrawData, setWithdrawData] = useState<WithdrawData>({
    amount: 0,
    withdrawMethod: "paypal",
    accountDetails: {},
  });

  const getTransactionIcon = (type: string, status: string) => {
    if (type === "credit") {
      return status === "completed" ? (
        <ArrowDownLeft className="w-4 h-4 text-green-600" />
      ) : (
        <Clock className="w-4 h-4 text-yellow-600" />
      );
    } else {
      return status === "completed" ? (
        <ArrowUpRight className="w-4 h-4 text-red-600" />
      ) : (
        <Clock className="w-4 h-4 text-yellow-600" />
      );
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: { variant: "default" as const, icon: CheckCircle },
      pending: { variant: "secondary" as const, icon: Clock },
      failed: { variant: "destructive" as const, icon: XCircle },
    };

    const config =
      variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="text-xs">
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredTransactions = walletData.transactions.filter((transaction) => {
    if (transactionFilter === "all") return true;
    return transaction.type === transactionFilter;
  });

  const handleAddFunds = async () => {
    if (addFundsData.amount <= 0) return;

    try {
      await onAddFunds(addFundsData.amount, addFundsData.paymentMethod);
      setShowAddFunds(false);
      setAddFundsData({ amount: 0, paymentMethod: "stripe" });
    } catch (error) {
      console.error("Failed to add funds:", error);
    }
  };

  const handleWithdraw = async () => {
    if (withdrawData.amount <= 0 || withdrawData.amount > walletData.balance)
      return;

    // Check minimum withdrawal amounts
    const minAmount =
      withdrawData.withdrawMethod === "paypal"
        ? PLATFORM_CONFIG.MIN_PAYPAL_WITHDRAWAL
        : PLATFORM_CONFIG.MIN_BANK_WITHDRAWAL;

    if (withdrawData.amount < minAmount) return;

    try {
      if (userRole === "teacher") {
        await onRequestPayout(withdrawData.amount, withdrawData.withdrawMethod);
      } else {
        await onWithdraw(withdrawData.amount, withdrawData.withdrawMethod);
      }
      setShowWithdraw(false);
      setWithdrawData({
        amount: 0,
        withdrawMethod: "paypal",
        accountDetails: {},
      });
    } catch (error) {
      console.error("Failed to process withdrawal:", error);
    }
  };

  const canWithdraw = () => {
    const minAmount =
      withdrawData.withdrawMethod === "paypal"
        ? PLATFORM_CONFIG.MIN_PAYPAL_WITHDRAWAL
        : PLATFORM_CONFIG.MIN_BANK_WITHDRAWAL;

    return (
      withdrawData.amount >= minAmount &&
      withdrawData.amount <= walletData.balance
    );
  };

  return (
    <>
      <div className={cn("space-y-6", className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Wallet</h2>
            <p className="text-muted-foreground">
              {userRole === "teacher"
                ? "Manage your earnings and payouts"
                : "Manage your balance and payments"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
            >
              {showBalance ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="relative overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {userRole === "teacher"
                      ? "Available Balance"
                      : "Wallet Balance"}
                  </p>
                  <p className="text-3xl font-bold">
                    {showBalance ? `$${walletData.balance.toFixed(2)}` : "••••"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {walletData.currency}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-full transform translate-x-8 -translate-y-8" />
            </CardContent>
          </Card>

          {userRole === "teacher" ? (
            <>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Earnings
                      </p>
                      <p className="text-2xl font-bold">
                        {showBalance
                          ? `$${walletData.totalEarnings.toFixed(2)}`
                          : "••••"}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <TrendingUp className="w-3 h-3" />
                        <span>+12% this month</span>
                      </div>
                    </div>
                    <PiggyBank className="w-6 h-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Pending Payouts
                      </p>
                      <p className="text-2xl font-bold">
                        {showBalance
                          ? `$${walletData.pendingPayouts.toFixed(2)}`
                          : "••••"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {
                          walletData.payouts.filter(
                            (p) => p.status === "pending",
                          ).length
                        }{" "}
                        requests
                      </p>
                    </div>
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Spent
                      </p>
                      <p className="text-2xl font-bold">
                        {showBalance
                          ? `$${walletData.totalSpent.toFixed(2)}`
                          : "••••"}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Target className="w-3 h-3" />
                        <span>All time</span>
                      </div>
                    </div>
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        This Month
                      </p>
                      <p className="text-2xl font-bold">
                        {showBalance
                          ? `$${walletData.monthlySpending.toFixed(2)}`
                          : "••••"}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-red-600">
                        <TrendingDown className="w-3 h-3" />
                        <span>Spent on lessons</span>
                      </div>
                    </div>
                    <Banknote className="w-6 h-6 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userRole === "student" && (
                <Button
                  onClick={() => setShowAddFunds(true)}
                  className="h-20 flex flex-col gap-2"
                  variant="outline"
                >
                  <Plus className="w-6 h-6" />
                  <span>Add Funds</span>
                </Button>
              )}

              <Button
                onClick={() => setShowWithdraw(true)}
                className="h-20 flex flex-col gap-2"
                variant="outline"
                disabled={walletData.balance <= 0}
              >
                <Minus className="w-6 h-6" />
                <span>
                  {userRole === "teacher" ? "Request Payout" : "Withdraw"}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detailed View */}
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            {userRole === "teacher" && (
              <TabsTrigger value="payouts">Payouts</TabsTrigger>
            )}
            {userRole === "student" && (
              <TabsTrigger value="spending">Spending</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Transaction History</CardTitle>
                  <Select
                    value={transactionFilter}
                    onValueChange={setTransactionFilter}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="credit">Credits</SelectItem>
                      <SelectItem value="debit">Debits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredTransactions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No transactions found</p>
                    </div>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {getTransactionIcon(
                            transaction.type,
                            transaction.status,
                          )}
                          <div>
                            <p className="font-medium">
                              {transaction.description}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(
                                parseISO(transaction.createdAt),
                                "MMM d, yyyy • h:mm a",
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={cn(
                              "font-medium",
                              transaction.type === "credit"
                                ? "text-green-600"
                                : "text-red-600",
                            )}
                          >
                            {transaction.type === "credit" ? "+" : "-"}$
                            {transaction.amount.toFixed(2)}
                          </p>
                          {getStatusBadge(transaction.status)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userRole === "teacher" ? (
                      <>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Earnings</span>
                            <span className="text-sm font-medium">
                              ${walletData.monthlyEarnings.toFixed(2)}
                            </span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Commission Paid</span>
                            <span className="text-sm font-medium">
                              $
                              {(
                                walletData.monthlyEarnings *
                                PLATFORM_CONFIG.COMMISSION_RATE
                              ).toFixed(2)}
                            </span>
                          </div>
                          <Progress value={20} className="h-2" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Spent on Lessons</span>
                            <span className="text-sm font-medium">
                              ${walletData.monthlySpending.toFixed(2)}
                            </span>
                          </div>
                          <Progress value={60} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Average per Lesson</span>
                            <span className="text-sm font-medium">$45.00</span>
                          </div>
                          <Progress value={45} className="h-2" />
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-sm">Credit Card</span>
                      </div>
                      <Badge variant="default">Primary</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        <span className="text-sm">PayPal</span>
                      </div>
                      <Badge variant="outline">Available</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {userRole === "teacher" && (
            <TabsContent value="payouts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payout History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {walletData.payouts.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No payout requests yet</p>
                      </div>
                    ) : (
                      walletData.payouts.map((payout) => (
                        <div
                          key={payout.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">
                              ${payout.amount.toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {payout.method} •{" "}
                              {format(
                                parseISO(payout.requestedAt),
                                "MMM d, yyyy",
                              )}
                            </p>
                          </div>
                          {getStatusBadge(payout.status)}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Add Funds Dialog */}
      {userRole === "student" && (
        <Dialog open={showAddFunds} onOpenChange={setShowAddFunds}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Funds to Wallet</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={addFundsData.amount}
                  onChange={(e) =>
                    setAddFundsData((prev) => ({
                      ...prev,
                      amount: parseFloat(e.target.value) || 0,
                    }))
                  }
                  min="10"
                  step="10"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum $10
                </p>
              </div>

              <div>
                <Label>Payment Method</Label>
                <Select
                  value={addFundsData.paymentMethod}
                  onValueChange={(value) =>
                    setAddFundsData((prev) => ({
                      ...prev,
                      paymentMethod: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Credit/Debit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="apple_pay">Apple Pay</SelectItem>
                    <SelectItem value="google_pay">Google Pay</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Funds will be available immediately after successful payment.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddFunds(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddFunds}
                  disabled={addFundsData.amount < 10}
                >
                  Add ${addFundsData.amount.toFixed(2)}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Withdraw/Payout Dialog */}
      <Dialog open={showWithdraw} onOpenChange={setShowWithdraw}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {userRole === "teacher" ? "Request Payout" : "Withdraw Funds"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <DollarSign className="h-4 w-4" />
              <AlertDescription>
                <strong>Available Balance:</strong> $
                {walletData.balance.toFixed(2)}
              </AlertDescription>
            </Alert>

            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={withdrawData.amount}
                onChange={(e) =>
                  setWithdrawData((prev) => ({
                    ...prev,
                    amount: parseFloat(e.target.value) || 0,
                  }))
                }
                max={walletData.balance}
                min={
                  withdrawData.withdrawMethod === "paypal"
                    ? PLATFORM_CONFIG.MIN_PAYPAL_WITHDRAWAL
                    : PLATFORM_CONFIG.MIN_BANK_WITHDRAWAL
                }
              />
            </div>

            <div>
              <Label>Withdrawal Method</Label>
              <Select
                value={withdrawData.withdrawMethod}
                onValueChange={(value) =>
                  setWithdrawData((prev) => ({
                    ...prev,
                    withdrawMethod: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paypal">
                    PayPal (Min. ${PLATFORM_CONFIG.MIN_PAYPAL_WITHDRAWAL})
                  </SelectItem>
                  <SelectItem value="bank_transfer">
                    Bank Transfer (Min. ${PLATFORM_CONFIG.MIN_BANK_WITHDRAWAL})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                {userRole === "teacher"
                  ? "Payout requests are processed within 2-3 business days after approval."
                  : "Withdrawals typically take 1-3 business days to process."}
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowWithdraw(false)}>
                Cancel
              </Button>
              <Button onClick={handleWithdraw} disabled={!canWithdraw()}>
                {userRole === "teacher" ? "Request Payout" : "Withdraw"} $
                {withdrawData.amount.toFixed(2)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default WalletDashboard;
