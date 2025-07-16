import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  FileText,
  Search,
  Clock,
  CheckCircle,
  AlertTriangle,
  MoreVertical,
  User,
  MessageSquare,
  ArrowLeft,
  Filter,
  Send,
  Paperclip,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  description: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  messages: SupportMessage[];
  attachments?: string[];
}

interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderType: "user" | "admin";
  message: string;
  timestamp: string;
  attachments?: string[];
}

export default function AdminSupport() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "open" | "in_progress" | "resolved" | "closed"
  >("all");
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | "low" | "medium" | "high" | "urgent"
  >("all");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null,
  );
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  const loadTickets = async () => {
    try {
      setIsLoading(true);

      // Mock support tickets data
      const mockTickets: SupportTicket[] = [
        {
          id: "ticket_1",
          userId: "user_123",
          userName: "John Doe",
          userEmail: "john@example.com",
          subject: "Payment Issue",
          category: "billing",
          priority: "high",
          status: "open",
          description:
            "I was charged twice for my lesson booking. Please help resolve this issue.",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          messages: [
            {
              id: "msg_1",
              ticketId: "ticket_1",
              senderId: "user_123",
              senderName: "John Doe",
              senderType: "user",
              message:
                "I was charged twice for my lesson booking. Please help resolve this issue.",
              timestamp: new Date(
                Date.now() - 2 * 60 * 60 * 1000,
              ).toISOString(),
            },
          ],
        },
        {
          id: "ticket_2",
          userId: "user_456",
          userName: "Sarah Wilson",
          userEmail: "sarah@example.com",
          subject: "Teacher Not Showing Up",
          category: "lesson",
          priority: "urgent",
          status: "in_progress",
          description:
            "My teacher didn't show up for our scheduled lesson. This is the second time.",
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          assignedTo: "Admin User",
          messages: [
            {
              id: "msg_2",
              ticketId: "ticket_2",
              senderId: "user_456",
              senderName: "Sarah Wilson",
              senderType: "user",
              message:
                "My teacher didn't show up for our scheduled lesson. This is the second time.",
              timestamp: new Date(
                Date.now() - 4 * 60 * 60 * 1000,
              ).toISOString(),
            },
            {
              id: "msg_3",
              ticketId: "ticket_2",
              senderId: "admin_1",
              senderName: "Admin User",
              senderType: "admin",
              message:
                "I'm sorry to hear about this issue. I'm looking into it and will contact the teacher immediately.",
              timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            },
          ],
        },
        {
          id: "ticket_3",
          userId: "teacher_789",
          userName: "Demo Teacher",
          userEmail: "demo@teacher.com",
          subject: "Payout Delay",
          category: "account",
          priority: "medium",
          status: "resolved",
          description:
            "My payout request has been pending for over a week. When will it be processed?",
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          assignedTo: "Admin User",
          messages: [
            {
              id: "msg_4",
              ticketId: "ticket_3",
              senderId: "teacher_789",
              senderName: "Demo Teacher",
              senderType: "user",
              message:
                "My payout request has been pending for over a week. When will it be processed?",
              timestamp: new Date(
                Date.now() - 24 * 60 * 60 * 1000,
              ).toISOString(),
            },
            {
              id: "msg_5",
              ticketId: "ticket_3",
              senderId: "admin_1",
              senderName: "Admin User",
              senderType: "admin",
              message:
                "Your payout has been approved and will be processed within 2-3 business days. Thank you for your patience.",
              timestamp: new Date(
                Date.now() - 12 * 60 * 60 * 1000,
              ).toISOString(),
            },
          ],
        },
      ];

      setTickets(mockTickets);
    } catch (error) {
      console.error("Failed to load support tickets:", error);
      toast({
        title: "Error",
        description: "Failed to load support tickets",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = tickets;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(
        (ticket) => ticket.priority === priorityFilter,
      );
    }

    setFilteredTickets(filtered);
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId
            ? {
                ...ticket,
                status: newStatus as any,
                updatedAt: new Date().toISOString(),
              }
            : ticket,
        ),
      );

      toast({
        title: "Success",
        description: "Ticket status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive",
      });
    }
  };

  const handleReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    try {
      const newMessage: SupportMessage = {
        id: `msg_${Date.now()}`,
        ticketId: selectedTicket.id,
        senderId: "admin_1",
        senderName: "Admin User",
        senderType: "admin",
        message: replyMessage,
        timestamp: new Date().toISOString(),
      };

      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === selectedTicket.id
            ? {
                ...ticket,
                messages: [...ticket.messages, newMessage],
                updatedAt: new Date().toISOString(),
                status:
                  ticket.status === "open" ? "in_progress" : ticket.status,
              }
            : ticket,
        ),
      );

      setSelectedTicket((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, newMessage],
              updatedAt: new Date().toISOString(),
            }
          : null,
      );

      setReplyMessage("");

      toast({
        title: "Success",
        description: "Reply sent successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      });
    }
  };

  const openTicketDialog = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setTicketDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="destructive">Open</Badge>;
      case "in_progress":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Resolved
          </Badge>
        );
      case "closed":
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>;
      case "high":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            Low
          </Badge>
        );
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const calculateStats = () => {
    const open = tickets.filter((t) => t.status === "open").length;
    const inProgress = tickets.filter((t) => t.status === "in_progress").length;
    const resolved = tickets.filter((t) => t.status === "resolved").length;
    const urgent = tickets.filter(
      (t) => t.priority === "urgent" && t.status !== "resolved",
    ).length;

    return { open, inProgress, resolved, urgent };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3">Loading support tickets...</span>
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
            <h1 className="text-3xl font-bold">Support Tickets</h1>
            <p className="text-muted-foreground">
              Manage customer support requests
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Open Tickets</p>
                <p className="text-2xl font-bold">{stats.open}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Resolved</p>
                <p className="text-2xl font-bold">{stats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Urgent</p>
                <p className="text-2xl font-bold">{stats.urgent}</p>
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
                  placeholder="Search tickets by subject, user, or description..."
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
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Support Tickets ({filteredTickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell onClick={() => openTicketDialog(ticket)}>
                      <div>
                        <div className="font-medium">{ticket.subject}</div>
                        <div className="text-sm text-muted-foreground">
                          {ticket.category} • {ticket.messages.length} message
                          {ticket.messages.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{ticket.userName}</div>
                        <div className="text-sm text-muted-foreground">
                          {ticket.userEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(ticket.updatedAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => openTicketDialog(ticket)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            View & Reply
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(ticket.id, "in_progress")
                            }
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            Mark In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(ticket.id, "resolved")
                            }
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Resolved
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTickets.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No support tickets found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ticket Detail Dialog */}
      <Dialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedTicket.subject}</span>
                  <div className="flex gap-2">
                    {getPriorityBadge(selectedTicket.priority)}
                    {getStatusBadge(selectedTicket.status)}
                  </div>
                </DialogTitle>
                <DialogDescription>
                  <div className="flex items-center space-x-4 text-sm">
                    <span>
                      From: {selectedTicket.userName} (
                      {selectedTicket.userEmail})
                    </span>
                    <span>•</span>
                    <span>
                      Created:{" "}
                      {new Date(selectedTicket.createdAt).toLocaleString()}
                    </span>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Messages */}
                <div className="space-y-4 max-h-96 overflow-y-auto border rounded-lg p-4">
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderType === "admin" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.senderType === "admin"
                            ? "bg-blue-500 text-white"
                            : "bg-muted"
                        }`}
                      >
                        <div className="text-sm font-medium mb-1">
                          {message.senderName}
                        </div>
                        <div className="text-sm mb-2">{message.message}</div>
                        <div className="text-xs opacity-70">
                          {new Date(message.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Reply to {selectedTicket.userName}
                  </label>
                  <Textarea
                    placeholder="Type your reply..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach File
                    </Button>
                    <div className="flex gap-2">
                      <select
                        value={selectedTicket.status}
                        onChange={(e) =>
                          handleStatusChange(selectedTicket.id, e.target.value)
                        }
                        className="px-3 py-1 border border-input rounded-md bg-background text-sm"
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                      <Button
                        onClick={handleReply}
                        disabled={!replyMessage.trim()}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
