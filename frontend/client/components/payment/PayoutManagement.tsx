import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Download,
  Plus,
  CreditCard,
  Building,
  Wallet,
  Eye,
  EyeOff,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Alert, AlertDescription } from "../ui/alert";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useAuth } from "../../contexts/AuthContext";
import { PLATFORM_CONFIG } from "../../api/config";
import { PayoutRequest, WalletTransaction } from "../../types/platform";
import { format, parseISO, subDays, startOfMonth, endOfMonth } from "date-fns";
import { cn } from "../../lib/utils";

interface PayoutManagementProps {
  availableBalance: number;
  totalEarnings: number;
  pendingPayouts: PayoutRequest[];
  completedPayouts: PayoutRequest[];
  recentTransactions: WalletTransaction[];
  onRequestPayout: (amount: number, method: string, details: any) => void;
  onCancelPayout: (payoutId: string) => void;
  className?: string;
}

interface PayoutMethod {
  id: string;
  type: "paypal" | "bank_transfer";
  name: string;
  details: Record<string, string>;
  isDefault: boolean;
}

interface PayoutRequestData {
  amount: number;
  method: string;
  methodDetails: Record<string, string>;
  note: string;
}

export function PayoutManagement({
  availableBalance,
  totalEarnings,
  pendingPayouts,
  completedPayouts,
  recentTransactions,
  onRequestPayout,
  onCancelPayout,
  className,
}: PayoutManagementProps) {
  const { user } = useAuth();
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showAddMethodDialog, setShowAddMethodDialog] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [payoutFilter, setPayoutFilter] = useState("all");

  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([
    {
      id: "1",
      type: "paypal",
      name: "PayPal Account",
      details: { email: "teacher@example.com" },
      isDefault: true,
    },
  ]);

  const [newPayoutRequest, setNewPayoutRequest] = useState<PayoutRequestData>({
    amount: 0,
    method: "",
    methodDetails: {},
    note: "",
  });

  const [newPayoutMethod, setNewPayoutMethod] = useState({
    type: "paypal" as "paypal" | "bank_transfer",
    email: "",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    accountHolderName: "",
    swiftCode: "",
  });

  // Calculate earnings stats
  const monthlyEarnings = recentTransactions
    .filter((t) => t.type === "credit" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = pendingPayouts.reduce((sum, p) => sum + p.amount, 0);
  const totalPaidOut = completedPayouts.reduce((sum, p) => sum + p.amount, 0);

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: {
        variant: "secondary" as const,
        icon: Clock,
        color: "text-orange-600",
      },
      processing: {
        variant: "default" as const,
        icon: RefreshCw,
        color: "text-blue-600",
      },
      completed: {
        variant: "default" as const,
        icon: CheckCircle,
        color: "text-green-600",
      },
      failed: {
        variant: "destructive" as const,
        icon: XCircle,
        color: "text-red-600",
      },
      cancelled: {
        variant: "outline" as const,
        icon: XCircle,
        color: "text-gray-600",
      },
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

  const getMinimumAmount = (method: string) => {
    return method === "paypal"
      ? PLATFORM_CONFIG.MIN_PAYPAL_WITHDRAWAL
      : PLATFORM_CONFIG.MIN_BANK_WITHDRAWAL;
  };

  const canRequestPayout = () => {
    const minAmount = getMinimumAmount(newPayoutRequest.method);
    return (
      newPayoutRequest.amount >= minAmount &&
      newPayoutRequest.amount <= availableBalance &&
      newPayoutRequest.method
    );
  };

  const handleRequestPayout = async () => {
    if (!canRequestPayout()) return;

    try {
      await onRequestPayout(
        newPayoutRequest.amount,
        newPayoutRequest.method,
        newPayoutRequest.methodDetails,
      );
      setShowRequestDialog(false);
      setNewPayoutRequest({
        amount: 0,
        method: "",
        methodDetails: {},
        note: "",
      });
    } catch (error) {
      console.error("Failed to request payout:", error);
    }
  };

  const handleAddPayoutMethod = () => {
    const newMethod: PayoutMethod = {
      id: Date.now().toString(),
      type: newPayoutMethod.type,
      name:
        newPayoutMethod.type === "paypal" ? "PayPal Account" : "Bank Account",
      details:
        newPayoutMethod.type === "paypal"
          ? { email: newPayoutMethod.email }
          : {
              bankName: newPayoutMethod.bankName,
              accountNumber: newPayoutMethod.accountNumber,
              routingNumber: newPayoutMethod.routingNumber,
              accountHolderName: newPayoutMethod.accountHolderName,
              swiftCode: newPayoutMethod.swiftCode,
            },
      isDefault: payoutMethods.length === 0,
    };

    setPayoutMethods((prev) => [...prev, newMethod]);
    setShowAddMethodDialog(false);
    setNewPayoutMethod({
      type: "paypal",
      email: "",
      bankName: "",
      accountNumber: "",
      routingNumber: "",
      accountHolderName: "",
      swiftCode: "",
    });
  };

  const filteredPayouts = [...pendingPayouts, ...completedPayouts].filter(
    (payout) => {
      if (payoutFilter === "all") return true;
      return payout.status === payoutFilter;
    },
  );

  return (
    <>
      <div className={cn("space-y-6", className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Payout Management</h2>
            <p className="text-muted-foreground">
              Manage your earnings and payout requests
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
            <Button
              onClick={() => setShowRequestDialog(true)}
              disabled={
                availableBalance < PLATFORM_CONFIG.MIN_PAYPAL_WITHDRAWAL
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Request Payout
            </Button>
          </div>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="relative overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Available Balance
                  </p>
                  <p className="text-3xl font-bold">
                    {showBalance ? `$${availableBalance.toFixed(2)}` : "••••"}
                  </p>
                  <p className="text-xs text-green-600">Ready for payout</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Earnings
                  </p>
                  <p className="text-2xl font-bold">
                    {showBalance ? `$${totalEarnings.toFixed(2)}` : "••••"}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>All time</span>
                  </div>
                </div>
                <TrendingUp className="w-6 h-6 text-blue-600" />
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
                    {showBalance ? `$${pendingAmount.toFixed(2)}` : "••••"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {pendingPayouts.length} request(s)
                  </p>
                </div>
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Paid Out
                  </p>
                  <p className="text-2xl font-bold">
                    {showBalance ? `$${totalPaidOut.toFixed(2)}` : "••••"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {completedPayouts.length} payment(s)
                  </p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => setShowRequestDialog(true)}
                className="h-20 flex flex-col gap-2"
                variant="outline"
                disabled={
                  availableBalance < PLATFORM_CONFIG.MIN_PAYPAL_WITHDRAWAL
                }
              >
                <DollarSign className="w-6 h-6" />
                <span>Request Payout</span>
              </Button>

              <Button
                onClick={() => setShowAddMethodDialog(true)}
                className="h-20 flex flex-col gap-2"
                variant="outline"
              >
                <Plus className="w-6 h-6" />
                <span>Add Payout Method</span>
              </Button>

              <Button className="h-20 flex flex-col gap-2" variant="outline">
                <Download className="w-6 h-6" />
                <span>Download Statement</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Tabs */}
        <Tabs defaultValue="payouts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="payouts">Payout History</TabsTrigger>
            <TabsTrigger value="methods">Payout Methods</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="payouts" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Payout Requests</CardTitle>
                  <Select value={payoutFilter} onValueChange={setPayoutFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredPayouts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No payout requests found</p>
                    </div>
                  ) : (
                    filteredPayouts.map((payout) => (
                      <div
                        key={payout.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-muted rounded-lg">
                            {payout.method === "paypal" ? (
                              <Wallet className="w-5 h-5" />
                            ) : (
                              <Building className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              ${payout.amount.toFixed(2)}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="capitalize">
                                {payout.method.replace("_", " ")}
                              </span>
                              <span>•</span>
                              <span>
                                {format(
                                  parseISO(payout.requestedAt),
                                  "MMM d, yyyy",
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(payout.status)}
                          {payout.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onCancelPayout(payout.id)}
                              className="text-red-600"
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="methods" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Payout Methods</CardTitle>
                  <Button onClick={() => setShowAddMethodDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Method
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payoutMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {method.type === "paypal" ? (
                          <Wallet className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Building className="w-5 h-5 text-green-600" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{method.name}</span>
                            {method.isDefault && (
                              <Badge variant="default" className="text-xs">
                                Default
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {method.type === "paypal"
                              ? method.details.email
                              : `${method.details.bankName} ****${method.details.accountNumber?.slice(-4)}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                          Min: ${getMinimumAmount(method.type)}
                        </p>
                      </div>
                    </div>
                  ))}
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
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Earnings This Month</span>
                        <span className="text-sm font-medium">
                          ${monthlyEarnings.toFixed(2)}
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
                            monthlyEarnings * PLATFORM_CONFIG.COMMISSION_RATE
                          ).toFixed(2)}
                        </span>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payout Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>PayPal: 1-2 business days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Bank Transfer: 3-5 business days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>International: 5-7 business days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Request Payout Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Payout</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <DollarSign className="h-4 w-4" />
              <AlertDescription>
                <strong>Available Balance:</strong> $
                {availableBalance.toFixed(2)}
              </AlertDescription>
            </Alert>

            <div>
              <Label>Payout Amount</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={newPayoutRequest.amount}
                onChange={(e) =>
                  setNewPayoutRequest((prev) => ({
                    ...prev,
                    amount: parseFloat(e.target.value) || 0,
                  }))
                }
                max={availableBalance}
              />
            </div>

            <div>
              <Label>Payout Method</Label>
              <Select
                value={newPayoutRequest.method}
                onValueChange={(value) =>
                  setNewPayoutRequest((prev) => ({ ...prev, method: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  {payoutMethods.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name} - Min: ${getMinimumAmount(method.type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Note (Optional)</Label>
              <Textarea
                placeholder="Add any notes for this payout request..."
                value={newPayoutRequest.note}
                onChange={(e) =>
                  setNewPayoutRequest((prev) => ({
                    ...prev,
                    note: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Payout requests are processed within 2-3 business days. You'll
                receive a confirmation email once processed.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowRequestDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRequestPayout}
                disabled={!canRequestPayout()}
              >
                Request ${newPayoutRequest.amount.toFixed(2)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Payout Method Dialog */}
      <Dialog open={showAddMethodDialog} onOpenChange={setShowAddMethodDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payout Method</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Method Type</Label>
              <Select
                value={newPayoutMethod.type}
                onValueChange={(value: "paypal" | "bank_transfer") =>
                  setNewPayoutMethod((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paypal">
                    PayPal (Min: ${PLATFORM_CONFIG.MIN_PAYPAL_WITHDRAWAL})
                  </SelectItem>
                  <SelectItem value="bank_transfer">
                    Bank Transfer (Min: ${PLATFORM_CONFIG.MIN_BANK_WITHDRAWAL})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newPayoutMethod.type === "paypal" ? (
              <div>
                <Label>PayPal Email</Label>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  value={newPayoutMethod.email}
                  onChange={(e) =>
                    setNewPayoutMethod((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label>Account Holder Name</Label>
                  <Input
                    placeholder="John Doe"
                    value={newPayoutMethod.accountHolderName}
                    onChange={(e) =>
                      setNewPayoutMethod((prev) => ({
                        ...prev,
                        accountHolderName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Bank Name</Label>
                  <Input
                    placeholder="Bank of America"
                    value={newPayoutMethod.bankName}
                    onChange={(e) =>
                      setNewPayoutMethod((prev) => ({
                        ...prev,
                        bankName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Account Number</Label>
                  <Input
                    placeholder="1234567890"
                    value={newPayoutMethod.accountNumber}
                    onChange={(e) =>
                      setNewPayoutMethod((prev) => ({
                        ...prev,
                        accountNumber: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Routing Number</Label>
                  <Input
                    placeholder="123456789"
                    value={newPayoutMethod.routingNumber}
                    onChange={(e) =>
                      setNewPayoutMethod((prev) => ({
                        ...prev,
                        routingNumber: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAddMethodDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddPayoutMethod}
                disabled={
                  newPayoutMethod.type === "paypal"
                    ? !newPayoutMethod.email
                    : !newPayoutMethod.accountHolderName ||
                      !newPayoutMethod.bankName ||
                      !newPayoutMethod.accountNumber ||
                      !newPayoutMethod.routingNumber
                }
              >
                Add Method
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PayoutManagement;
