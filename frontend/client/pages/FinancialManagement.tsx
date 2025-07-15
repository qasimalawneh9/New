import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  Search,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Receipt,
  FileText,
  Eye,
  Building,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { ScrollArea } from "../components/ui/scroll-area";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
// Date picker removed for now
import { PaymentGateway } from "../components/index";
import {
  User as UserType,
  WalletTransaction,
  PaymentMethod,
  PayoutRequest,
  Booking,
} from "../types/platform";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../components/ui/use-toast";
import { cn } from "../lib/utils";
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  addDays,
  isWithinInterval,
} from "date-fns";

// Mock data
const mockUser: UserType = {
  id: "user-123",
  name: "John Doe",
  email: "john.doe@example.com",
  role: "teacher",
  profileImage: "",
  timezone: "America/New_York",
  emailVerified: true,
  twoFactorEnabled: false,
  status: "active",
  createdAt: "2023-06-15",
  updatedAt: "2024-01-20",
};

const mockWalletTransactions: WalletTransaction[] = [
  {
    id: "wt-1",
    userId: "user-123",
    type: "credit",
    amount: 150.0,
    description: "Lesson payment from Student A",
    status: "completed",
    paymentMethod: "platform",
    referenceId: "booking-123",
    createdAt: "2024-01-20T10:30:00Z",
  },
  {
    id: "wt-2",
    userId: "user-123",
    type: "debit",
    amount: 250.0,
    description: "Payout to PayPal",
    status: "completed",
    paymentMethod: "paypal",
    referenceId: "payout-456",
    createdAt: "2024-01-18T14:20:00Z",
  },
  {
    id: "wt-3",
    userId: "user-123",
    type: "credit",
    amount: 75.0,
    description: "Lesson payment from Student B",
    status: "completed",
    paymentMethod: "platform",
    referenceId: "booking-124",
    createdAt: "2024-01-17T16:45:00Z",
  },
  {
    id: "wt-4",
    userId: "user-123",
    type: "credit",
    amount: 100.0,
    description: "Wallet top-up via Credit Card",
    status: "completed",
    paymentMethod: "visa",
    createdAt: "2024-01-15T09:15:00Z",
  },
];

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm-1",
    type: "visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
  },
  {
    id: "pm-2",
    type: "paypal",
    email: "john.doe@example.com",
    isDefault: false,
  },
];

const mockPayoutRequests: PayoutRequest[] = [
  {
    id: "payout-1",
    teacherId: "user-123",
    amount: 450.0,
    method: "paypal",
    details: { email: "john.doe@example.com" },
    status: "pending",
    requestedAt: "2024-01-19T12:00:00Z",
  },
  {
    id: "payout-2",
    teacherId: "user-123",
    amount: 250.0,
    method: "paypal",
    details: { email: "john.doe@example.com" },
    status: "approved",
    requestedAt: "2024-01-10T10:00:00Z",
    processedAt: "2024-01-12T15:30:00Z",
  },
];

const mockBookings: Booking[] = [
  {
    id: "booking-123",
    studentId: "student-789",
    teacherId: "user-123",
    timeSlotId: "slot-1",
    date: "2024-01-20",
    startTime: "10:00",
    endTime: "11:00",
    duration: 60,
    status: "completed",
    price: 25,
    commission: 5,
    tax: 1.75,
    totalPrice: 31.75,
    rescheduleCount: 0,
    completedAt: "2024-01-20T11:00:00Z",
    createdAt: "2024-01-18T12:00:00Z",
    updatedAt: "2024-01-20T11:00:00Z",
  },
];

export default function FinancialManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [currentUser] = useState<UserType>(mockUser);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(
    mockWalletTransactions,
  );
  const [paymentMethods, setPaymentMethods] =
    useState<PaymentMethod[]>(mockPaymentMethods);
  const [payoutRequests, setPayoutRequests] =
    useState<PayoutRequest[]>(mockPayoutRequests);
  const [bookings] = useState<Booking[]>(mockBookings);
  const [selectedTimeframe, setSelectedTimeframe] = useState("this_month");
  const [searchQuery, setSearchQuery] = useState("");
  const [transactionFilter, setTransactionFilter] = useState("all");
  const [showTopUpDialog, setShowTopUpDialog] = useState(false);
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  } | null>(null);

  // Calculate wallet balance
  const walletBalance = transactions
    .filter((t) => t.status === "completed")
    .reduce(
      (sum, t) => (t.type === "credit" ? sum + t.amount : sum - t.amount),
      0,
    );

  // Calculate earnings
  const completedLessons = bookings.filter((b) => b.status === "completed");
  const totalEarnings = completedLessons.reduce(
    (sum, booking) => sum + (booking.price - booking.commission),
    0,
  );

  // Monthly stats
  const thisMonth = {
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  };

  const thisMonthTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.createdAt);
    return isWithinInterval(transactionDate, thisMonth);
  });

  const thisMonthEarnings = thisMonthTransactions
    .filter((t) => t.type === "credit" && t.paymentMethod === "platform")
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonthPayouts = thisMonthTransactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      transactionFilter === "all" ||
      (transactionFilter === "credit" && transaction.type === "credit") ||
      (transactionFilter === "debit" && transaction.type === "debit");
    const matchesDate =
      !dateRange ||
      isWithinInterval(new Date(transaction.createdAt), {
        start: dateRange.from,
        end: dateRange.to,
      });

    return matchesSearch && matchesFilter && matchesDate;
  });

  const handleTopUp = async (paymentData: any) => {
    try {
      console.log("Processing top-up:", paymentData);

      const newTransaction: WalletTransaction = {
        id: `wt-${Date.now()}`,
        userId: currentUser.id,
        type: "credit",
        amount: paymentData.amount,
        description: `Wallet top-up via ${paymentData.method}`,
        status: "completed",
        paymentMethod: paymentData.method,
        createdAt: new Date().toISOString(),
      };

      setTransactions((prev) => [newTransaction, ...prev]);

      toast({
        title: "Success",
        description: "Wallet topped up successfully!",
      });

      setShowTopUpDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePayoutRequest = async (amount: number, method: string) => {
    try {
      const newPayout: PayoutRequest = {
        id: `payout-${Date.now()}`,
        teacherId: currentUser.id,
        amount,
        method: method as "paypal" | "bank_transfer",
        details:
          method === "paypal"
            ? { email: currentUser.email }
            : { bankName: "Bank Name" },
        status: "pending",
        requestedAt: new Date().toISOString(),
      };

      setPayoutRequests((prev) => [newPayout, ...prev]);

      toast({
        title: "Success",
        description: "Payout request submitted successfully!",
      });

      setShowPayoutDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit payout request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportTransactions = () => {
    // Generate CSV export
    const csv = [
      ["Date", "Type", "Amount", "Description", "Status"],
      ...filteredTransactions.map((t) => [
        format(new Date(t.createdAt), "yyyy-MM-dd HH:mm"),
        t.type,
        t.amount,
        t.description,
        t.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Transaction history exported successfully!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Financial Management</h1>
              <p className="text-muted-foreground">
                Manage your earnings, payments, and withdrawals
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={selectedTimeframe}
                onValueChange={setSelectedTimeframe}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this_week">This Week</SelectItem>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  <SelectItem value="all_time">All Time</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportTransactions}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Wallet Balance
                  </p>
                  <h3 className="text-2xl font-bold">
                    ${walletBalance.toFixed(2)}
                  </h3>
                </div>
                <Wallet className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Earnings
                  </p>
                  <h3 className="text-2xl font-bold">
                    ${totalEarnings.toFixed(2)}
                  </h3>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    This Month
                  </p>
                  <h3 className="text-2xl font-bold">
                    ${thisMonthEarnings.toFixed(2)}
                  </h3>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending Payouts
                  </p>
                  <h3 className="text-2xl font-bold">
                    $
                    {payoutRequests
                      .filter((p) => p.status === "pending")
                      .reduce((sum, p) => sum + p.amount, 0)
                      .toFixed(2)}
                  </h3>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setShowTopUpDialog(true)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Plus className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Top Up Wallet</h3>
                  <p className="text-sm text-muted-foreground">
                    Add funds to your account
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setShowPayoutDialog(true)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ArrowDownLeft className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Request Payout</h3>
                  <p className="text-sm text-muted-foreground">
                    Withdraw your earnings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Receipt className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">View Reports</h3>
                  <p className="text-sm text-muted-foreground">
                    Download financial reports
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="payments">Payment Methods</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select
                    value={transactionFilter}
                    onValueChange={setTransactionFilter}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="credit">Credits</SelectItem>
                      <SelectItem value="debit">Debits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTransactions.map((transaction) => (
                    <TransactionCard
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))}
                  {filteredTransactions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Receipt className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No transactions found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payouts Tab */}
          <TabsContent value="payouts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payout Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payoutRequests.map((payout) => (
                    <PayoutCard key={payout.id} payout={payout} />
                  ))}
                  {payoutRequests.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <ArrowDownLeft className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No payout requests</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <PaymentMethodCard key={method.id} method={method} />
                  ))}
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ReportCard
                    title="Monthly Earnings Report"
                    description="Detailed breakdown of monthly earnings"
                    icon={TrendingUp}
                    onDownload={() => console.log("Download monthly report")}
                  />
                  <ReportCard
                    title="Transaction History"
                    description="Complete transaction history export"
                    icon={Receipt}
                    onDownload={handleExportTransactions}
                  />
                  <ReportCard
                    title="Tax Report"
                    description="Tax-ready financial summary"
                    icon={FileText}
                    onDownload={() => console.log("Download tax report")}
                  />
                  <ReportCard
                    title="Payout Summary"
                    description="Summary of all payout requests"
                    icon={Building}
                    onDownload={() => console.log("Download payout summary")}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Top Up Dialog */}
      <Dialog open={showTopUpDialog} onOpenChange={setShowTopUpDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Top Up Wallet</DialogTitle>
          </DialogHeader>
          <PaymentGateway
            amount={50}
            currency="USD"
            description="Wallet Top-up"
            platformFeePercentage={0}
            taxPercentage={0}
            paymentMethods={paymentMethods}
            walletBalance={walletBalance}
            onPayment={handleTopUp}
            onAddPaymentMethod={async () => {}}
          />
        </DialogContent>
      </Dialog>

      {/* Payout Dialog */}
      <Dialog open={showPayoutDialog} onOpenChange={setShowPayoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Payout</DialogTitle>
          </DialogHeader>
          <PayoutForm
            availableBalance={walletBalance}
            onSubmit={handlePayoutRequest}
            onCancel={() => setShowPayoutDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sub-components
function TransactionCard({ transaction }: { transaction: WalletTransaction }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "pending":
        return Clock;
      case "failed":
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const StatusIcon = getStatusIcon(transaction.status);

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            transaction.type === "credit" ? "bg-green-100" : "bg-red-100",
          )}
        >
          {transaction.type === "credit" ? (
            <ArrowUpRight className="h-5 w-5 text-green-600" />
          ) : (
            <ArrowDownLeft className="h-5 w-5 text-red-600" />
          )}
        </div>
        <div>
          <h4 className="font-medium">{transaction.description}</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {format(new Date(transaction.createdAt), "MMM d, yyyy")}
            </span>
            <span>•</span>
            <span>{transaction.paymentMethod}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div
          className={cn(
            "font-bold",
            transaction.type === "credit" ? "text-green-600" : "text-red-600",
          )}
        >
          {transaction.type === "credit" ? "+" : "-"}$
          {transaction.amount.toFixed(2)}
        </div>
        <div
          className={cn(
            "flex items-center gap-1",
            getStatusColor(transaction.status),
          )}
        >
          <StatusIcon className="h-3 w-3" />
          <span className="text-xs capitalize">{transaction.status}</span>
        </div>
      </div>
    </div>
  );
}

function PayoutCard({ payout }: { payout: PayoutRequest }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <ArrowDownLeft className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h4 className="font-medium">${payout.amount.toFixed(2)}</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{format(new Date(payout.requestedAt), "MMM d, yyyy")}</span>
            <span>•</span>
            <span className="capitalize">{payout.method}</span>
          </div>
        </div>
      </div>
      <Badge className={getStatusColor(payout.status)}>{payout.status}</Badge>
    </div>
  );
}

function PaymentMethodCard({ method }: { method: PaymentMethod }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
          <CreditCard className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-medium">
            {method.type === "paypal" ? "PayPal" : `•••• ${method.last4}`}
          </h4>
          <p className="text-sm text-muted-foreground">
            {method.type === "paypal"
              ? method.email
              : `${method.type.toUpperCase()} • ${method.expiryMonth}/${method.expiryYear}`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {method.isDefault && <Badge variant="outline">Default</Badge>}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Set as Default</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function ReportCard({
  title,
  description,
  icon: Icon,
  onDownload,
}: {
  title: string;
  description: string;
  icon: any;
  onDownload: () => void;
}) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">{title}</h4>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PayoutForm({
  availableBalance,
  onSubmit,
  onCancel,
}: {
  availableBalance: number;
  onSubmit: (amount: number, method: string) => void;
  onCancel: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("paypal");

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    const minAmount = method === "paypal" ? 10 : 100;

    if (numAmount >= minAmount && numAmount <= availableBalance) {
      onSubmit(numAmount, method);
    }
  };

  const minAmount = method === "paypal" ? 10 : 100;

  return (
    <div className="space-y-4">
      <Alert>
        <Wallet className="h-4 w-4" />
        <AlertDescription>
          Available balance: ${availableBalance.toFixed(2)}
        </AlertDescription>
      </Alert>

      <div>
        <label className="text-sm font-medium mb-2 block">Amount</label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          min={minAmount}
          max={availableBalance}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Minimum payout: ${minAmount}
        </p>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Method</label>
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paypal">PayPal (minimum $10)</SelectItem>
            <SelectItem value="bank_transfer">
              Bank Transfer (minimum $100)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={
            !amount ||
            parseFloat(amount) < minAmount ||
            parseFloat(amount) > availableBalance
          }
          className="flex-1"
        >
          Request Payout
        </Button>
      </div>
    </div>
  );
}
