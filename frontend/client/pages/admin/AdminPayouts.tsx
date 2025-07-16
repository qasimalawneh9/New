import React, { useState, useEffect } from "react";
import {
  adminDashboardService,
  type AdminPayoutRequest,
} from "@/api/services/admin-dashboard.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CreditCard,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  DollarSign,
  AlertTriangle,
  ArrowLeft,
  Download,
  Calendar,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function AdminPayouts() {
  const navigate = useNavigate();
  const [payouts, setPayouts] = useState<AdminPayoutRequest[]>([]);
  const [filteredPayouts, setFilteredPayouts] = useState<AdminPayoutRequest[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected" | "completed"
  >("all");
  const [selectedPayout, setSelectedPayout] =
    useState<AdminPayoutRequest | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null,
  );
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    loadPayouts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [payouts, searchTerm, statusFilter]);

  const loadPayouts = async () => {
    try {
      setIsLoading(true);
      const payoutData = adminDashboardService.getPayoutRequests();
      setPayouts(payoutData);
    } catch (error) {
      console.error("Failed to load payouts:", error);
      toast({
        title: "Error",
        description: "Failed to load payout requests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = payouts;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (payout) =>
          payout.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payout.teacherEmail.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((payout) => payout.status === statusFilter);
    }

    setFilteredPayouts(filtered);
  };

  const handlePayoutAction = async (
    payout: AdminPayoutRequest,
    action: "approve" | "reject",
  ) => {
    try {
      const success = await adminDashboardService.processPayoutRequest(
        payout.id,
        action,
        adminNotes,
      );

      if (success) {
        toast({
          title: "Success",
          description: `Payout request ${action}d successfully`,
        });
        await loadPayouts();
      } else {
        throw new Error(`Failed to ${action} payout request`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} payout request`,
        variant: "destructive",
      });
    }

    setActionDialogOpen(false);
    setSelectedPayout(null);
    setActionType(null);
    setAdminNotes("");
  };

  const openActionDialog = (
    payout: AdminPayoutRequest,
    action: "approve" | "reject",
  ) => {
    setSelectedPayout(payout);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Approved
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case "paypal":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            PayPal
          </Badge>
        );
      case "bank_transfer":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Bank Transfer
          </Badge>
        );
      default:
        return <Badge variant="outline">{method}</Badge>;
    }
  };

  const calculateStats = () => {
    const pending = payouts.filter((p) => p.status === "pending");
    const approved = payouts.filter(
      (p) => p.status === "approved" || p.status === "completed",
    );
    const rejected = payouts.filter((p) => p.status === "rejected");

    const totalPendingAmount = pending.reduce((sum, p) => sum + p.amount, 0);
    const totalApprovedAmount = approved.reduce((sum, p) => sum + p.amount, 0);

    return {
      pendingCount: pending.length,
      approvedCount: approved.length,
      rejectedCount: rejected.length,
      totalPendingAmount,
      totalApprovedAmount,
    };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3">Loading payout requests...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Payout Management</h1>
            <p className="text-muted-foreground">
              Review and process teacher payout requests
            </p>
          </div>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Pending Requests</p>
                <p className="text-2xl font-bold">{stats.pendingCount}</p>
                <p className="text-xs text-muted-foreground">
                  ${stats.totalPendingAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Approved</p>
                <p className="text-2xl font-bold">{stats.approvedCount}</p>
                <p className="text-xs text-muted-foreground">
                  ${stats.totalApprovedAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Rejected</p>
                <p className="text-2xl font-bold">{stats.rejectedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Requests</p>
                <p className="text-2xl font-bold">{payouts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by teacher name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payouts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Requests ({filteredPayouts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Processed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payout.teacherName}</div>
                        <div className="text-sm text-muted-foreground">
                          {payout.teacherEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono font-bold text-lg">
                        ${payout.amount.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>{getMethodBadge(payout.method)}</TableCell>
                    <TableCell>{getStatusBadge(payout.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(payout.requestedAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {payout.processedAt ? (
                          new Date(payout.processedAt).toLocaleDateString()
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {payout.status === "pending" ? (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            onClick={() => openActionDialog(payout, "approve")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => openActionDialog(payout, "reject")}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <User className="h-4 w-4 mr-2" />
                              View Teacher
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download Receipt
                            </DropdownMenuItem>
                            {payout.adminNotes && (
                              <DropdownMenuItem>
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                View Notes
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPayouts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No payout requests found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve"
                ? "Approve Payout Request"
                : "Reject Payout Request"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? `Approve payout of $${selectedPayout?.amount.toFixed(2)} to ${selectedPayout?.teacherName}?`
                : `Reject payout request from ${selectedPayout?.teacherName}?`}
            </DialogDescription>
          </DialogHeader>

          {selectedPayout && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Teacher:</span>
                  <span>{selectedPayout.teacherName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Amount:</span>
                  <span className="font-mono">
                    ${selectedPayout.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Method:</span>
                  <span>{selectedPayout.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Requested:</span>
                  <span>
                    {new Date(selectedPayout.requestedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {actionType === "approve"
                    ? "Processing Notes (Optional)"
                    : "Rejection Reason"}
                </label>
                <Textarea
                  placeholder={
                    actionType === "approve"
                      ? "Add any processing notes..."
                      : "Please provide a reason for rejection..."
                  }
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={actionType === "approve" ? "default" : "destructive"}
              onClick={() =>
                selectedPayout &&
                actionType &&
                handlePayoutAction(selectedPayout, actionType)
              }
              disabled={actionType === "reject" && !adminNotes.trim()}
            >
              {actionType === "approve" ? "Approve Payout" : "Reject Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
