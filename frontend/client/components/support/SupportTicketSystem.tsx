import React, { useState } from "react";
import {
  MessageSquare,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Paperclip,
  Send,
  User,
  Calendar,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Alert, AlertDescription } from "../ui/alert";
import {
  SupportTicket,
  SupportMessage,
  User as UserType,
} from "../../types/platform";
import { cn } from "../../lib/utils";
import { format } from "date-fns";

interface SupportTicketSystemProps {
  tickets: SupportTicket[];
  currentUser: UserType;
  onCreateTicket: (ticket: Partial<SupportTicket>) => Promise<void>;
  onSendMessage: (
    ticketId: string,
    content: string,
    attachments?: File[],
  ) => Promise<void>;
  onCloseTicket: (ticketId: string) => Promise<void>;
  isStaff?: boolean;
  className?: string;
}

const ticketCategories = [
  {
    value: "booking_issues",
    label: "Booking Issues",
    description: "For problems with scheduling or lesson timing",
    icon: Calendar,
  },
  {
    value: "payment_issues",
    label: "Payment Issues",
    description: "For failed payments or withdrawal problems",
    icon: AlertCircle,
  },
  {
    value: "technical_issues",
    label: "Technical Issues",
    description: "For website or application malfunctions",
    icon: AlertCircle,
  },
  {
    value: "inappropriate_behavior",
    label: "Inappropriate Behavior",
    description: "For reporting misconduct or abuse",
    icon: AlertCircle,
  },
];

const priorityOptions = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
  { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
];

const statusOptions = [
  {
    value: "open",
    label: "Open",
    icon: Clock,
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "in_progress",
    label: "In Progress",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "resolved",
    label: "Resolved",
    icon: CheckCircle,
    color: "bg-green-100 text-green-800",
  },
  {
    value: "closed",
    label: "Closed",
    icon: XCircle,
    color: "bg-gray-100 text-gray-800",
  },
];

export function SupportTicketSystem({
  tickets,
  currentUser,
  onCreateTicket,
  onSendMessage,
  onCloseTicket,
  isStaff = false,
  className,
}: SupportTicketSystemProps) {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null,
  );
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [messageInput, setMessageInput] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || ticket.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || ticket.category === filterCategory;
    const matchesUser = isStaff || ticket.userId === currentUser.id;

    return matchesSearch && matchesStatus && matchesCategory && matchesUser;
  });

  const handleSendMessage = async () => {
    if (!selectedTicket || !messageInput.trim()) return;

    try {
      await onSendMessage(selectedTicket.id, messageInput, attachments);
      setMessageInput("");
      setAttachments([]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find((s) => s.value === status);
    return statusOption?.color || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority: string) => {
    const priorityOption = priorityOptions.find((p) => p.value === priority);
    return priorityOption?.color || "bg-gray-100 text-gray-800";
  };

  return (
    <div className={cn("flex h-full", className)}>
      {/* Tickets List */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Support Tickets</h2>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Ticket
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <CreateTicketForm
                  onSubmit={async (ticket) => {
                    await onCreateTicket(ticket);
                    setShowCreateDialog(false);
                  }}
                  onCancel={() => setShowCreateDialog(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filters */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {ticketCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {filteredTickets.map((ticket) => (
              <TicketItem
                key={ticket.id}
                ticket={ticket}
                isSelected={selectedTicket?.id === ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                getStatusColor={getStatusColor}
                getPriorityColor={getPriorityColor}
              />
            ))}
            {filteredTickets.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No tickets found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Ticket Details */}
      <div className="flex-1 flex flex-col">
        {selectedTicket ? (
          <>
            {/* Ticket Header */}
            <div className="p-4 border-b">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {selectedTicket.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedTicket.description}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <Badge className={getStatusColor(selectedTicket.status)}>
                      {selectedTicket.status.replace("_", " ")}
                    </Badge>
                    <Badge
                      className={getPriorityColor(selectedTicket.priority)}
                    >
                      {selectedTicket.priority}
                    </Badge>
                    <Badge variant="outline">
                      {
                        ticketCategories.find(
                          (c) => c.value === selectedTicket.category,
                        )?.label
                      }
                    </Badge>
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>
                    Created{" "}
                    {format(new Date(selectedTicket.createdAt), "MMM d, yyyy")}
                  </p>
                  {selectedTicket.resolvedAt && (
                    <p>
                      Resolved{" "}
                      {format(
                        new Date(selectedTicket.resolvedAt),
                        "MMM d, yyyy",
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedTicket.messages.map((message) => (
                  <MessageItem
                    key={message.id}
                    message={message}
                    isOwn={message.senderId === currentUser.id}
                    currentUser={currentUser}
                  />
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            {selectedTicket.status !== "closed" && (
              <div className="p-4 border-t">
                <div className="space-y-3">
                  {/* Attachments */}
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-muted px-3 py-1 rounded-lg text-sm"
                        >
                          <Paperclip className="h-3 w-3" />
                          <span className="truncate max-w-32">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() =>
                              setAttachments((prev) =>
                                prev.filter((_, i) => i !== index),
                              )
                            }
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Input */}
                  <div className="flex gap-2">
                    <Textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type your message..."
                      className="min-h-[80px] resize-none"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.multiple = true;
                          input.accept = "image/*,.pdf,.txt,.doc,.docx";
                          input.onchange = (e) => {
                            const files = Array.from(
                              (e.target as HTMLInputElement).files || [],
                            );
                            setAttachments((prev) => [...prev, ...files]);
                          };
                          input.click();
                        }}
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        size="sm"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No ticket selected</h3>
              <p>Choose a ticket to view details and messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-components
function TicketItem({
  ticket,
  isSelected,
  onClick,
  getStatusColor,
  getPriorityColor,
}: {
  ticket: SupportTicket;
  isSelected: boolean;
  onClick: () => void;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
}) {
  const hasUnreadMessages = ticket.messages.some(
    (m) => !m.isStaff && !m.senderId,
  );

  return (
    <div
      className={cn(
        "p-3 rounded-lg cursor-pointer transition-colors border",
        isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted",
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium truncate flex-1">{ticket.title}</h4>
        {hasUnreadMessages && (
          <div className="w-2 h-2 bg-red-500 rounded-full ml-2 flex-shrink-0" />
        )}
      </div>
      <p className="text-sm opacity-80 truncate mb-2">{ticket.description}</p>
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className={cn(
            "text-xs",
            !isSelected && getStatusColor(ticket.status),
          )}
        >
          {ticket.status.replace("_", " ")}
        </Badge>
        <Badge
          variant="outline"
          className={cn(
            "text-xs",
            !isSelected && getPriorityColor(ticket.priority),
          )}
        >
          {ticket.priority}
        </Badge>
      </div>
      <p className="text-xs opacity-60 mt-1">
        {format(new Date(ticket.createdAt), "MMM d, HH:mm")}
      </p>
    </div>
  );
}

function MessageItem({
  message,
  isOwn,
  currentUser,
}: {
  message: SupportMessage;
  isOwn: boolean;
  currentUser: UserType;
}) {
  return (
    <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[70%] space-y-2")}>
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="text-xs">
              {message.isStaff ? "S" : "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">
            {message.isStaff ? "Support Staff" : currentUser.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(message.createdAt), "MMM d, HH:mm")}
          </span>
        </div>
        <div
          className={cn(
            "rounded-lg p-3",
            isOwn ? "bg-primary text-primary-foreground" : "bg-muted",
          )}
        >
          <p className="text-sm">{message.content}</p>
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-1">
              {message.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center gap-2 text-xs"
                >
                  <Paperclip className="h-3 w-3" />
                  <span>{attachment.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CreateTicketForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (ticket: Partial<SupportTicket>) => Promise<void>;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    priority: "medium" as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.category ||
      !formData.title.trim() ||
      !formData.description.trim()
    ) {
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>Create Support Ticket</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        {/* Category */}
        <div>
          <label className="text-sm font-medium mb-2 block">Category *</label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {ticketCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  <div>
                    <div className="font-medium">{category.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {category.description}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Priority */}
        <div>
          <label className="text-sm font-medium mb-2 block">Priority</label>
          <Select
            value={formData.priority}
            onValueChange={(value: any) =>
              setFormData({ ...formData, priority: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  {priority.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Title */}
        <div>
          <label className="text-sm font-medium mb-2 block">Title *</label>
          <Input
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Brief summary of the issue"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Description *
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Detailed description of the issue"
            rows={4}
            required
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={
            !formData.category ||
            !formData.title.trim() ||
            !formData.description.trim()
          }
        >
          Create Ticket
        </Button>
      </div>
    </form>
  );
}

export default SupportTicketSystem;
