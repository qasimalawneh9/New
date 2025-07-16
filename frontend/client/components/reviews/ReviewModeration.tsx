import React, { useState } from "react";
import {
  Flag,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  AlertTriangle,
  Clock,
  Filter,
  Search,
  MoreHorizontal,
  Star,
  User,
  MessageSquare,
  Ban,
  Shield,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Alert, AlertDescription } from "../ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { Review } from "../../types/platform";
import { format, parseISO } from "date-fns";
import { cn } from "../../lib/utils";

interface ReviewModerationProps {
  reviews: Review[];
  onApprove: (reviewId: string, note?: string) => void;
  onReject: (reviewId: string, reason: string) => void;
  onHide: (reviewId: string, reason: string) => void;
  onSuspendUser: (userId: string, reason: string) => void;
  className?: string;
}

interface ModerationAction {
  reviewId: string;
  action: "approve" | "reject" | "hide";
  reason?: string;
  note?: string;
}

interface FilterOptions {
  status: "all" | "pending" | "reported" | "approved" | "rejected";
  rating: "all" | "1" | "2" | "3" | "4" | "5";
  priority: "all" | "high" | "medium" | "low";
  dateRange: "all" | "today" | "week" | "month";
}

export function ReviewModeration({
  reviews,
  onApprove,
  onReject,
  onHide,
  onSuspendUser,
  className,
}: ReviewModerationProps) {
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    status: "pending",
    rating: "all",
    priority: "all",
    dateRange: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [currentAction, setCurrentAction] = useState<ModerationAction | null>(
    null,
  );
  const [actionReason, setActionReason] = useState("");
  const [bulkActionType, setBulkActionType] = useState<
    "approve" | "reject" | "hide" | null
  >(null);

  // Filter reviews based on current filters
  const filteredReviews = reviews.filter((review) => {
    if (filters.status !== "all") {
      const statusMap = {
        pending: review.isReported && !review.moderationStatus,
        reported: review.isReported,
        approved: review.moderationStatus === "approved",
        rejected: review.moderationStatus === "rejected",
      };
      if (!statusMap[filters.status as keyof typeof statusMap]) return false;
    }

    if (
      filters.rating !== "all" &&
      review.rating.toString() !== filters.rating
    ) {
      return false;
    }

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        review.content?.toLowerCase().includes(searchLower) ||
        review.studentName?.toLowerCase().includes(searchLower) ||
        review.teacherName?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const getStatusBadge = (review: Review) => {
    if (review.isReported && !review.moderationStatus) {
      return (
        <Badge variant="destructive">
          <Flag className="w-3 h-3 mr-1" />
          Pending Review
        </Badge>
      );
    }
    if (review.moderationStatus === "approved") {
      return (
        <Badge variant="default">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    }
    if (review.moderationStatus === "rejected") {
      return (
        <Badge variant="destructive">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      );
    }
    if (review.moderationStatus === "hidden") {
      return (
        <Badge variant="outline">
          <EyeOff className="w-3 h-3 mr-1" />
          Hidden
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <Clock className="w-3 h-3 mr-1" />
        Awaiting Review
      </Badge>
    );
  };

  const getPriorityLevel = (review: Review): "high" | "medium" | "low" => {
    if (review.rating <= 2 && review.isReported) return "high";
    if (review.isReported) return "medium";
    return "low";
  };

  const getPriorityBadge = (priority: "high" | "medium" | "low") => {
    const variants = {
      high: { variant: "destructive" as const, label: "High Priority" },
      medium: { variant: "secondary" as const, label: "Medium Priority" },
      low: { variant: "outline" as const, label: "Low Priority" },
    };

    const config = variants[priority];
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  const handleSingleAction = (
    reviewId: string,
    action: "approve" | "reject" | "hide",
  ) => {
    setCurrentAction({ reviewId, action });
    if (action === "approve") {
      onApprove(reviewId);
    } else {
      setShowActionDialog(true);
    }
  };

  const handleBulkAction = () => {
    if (!bulkActionType || selectedReviews.length === 0) return;

    selectedReviews.forEach((reviewId) => {
      if (bulkActionType === "approve") {
        onApprove(reviewId);
      } else {
        // For reject/hide, we'd need to collect reasons - simplified for demo
        if (bulkActionType === "reject") {
          onReject(reviewId, "Bulk moderation action");
        } else {
          onHide(reviewId, "Bulk moderation action");
        }
      }
    });

    setSelectedReviews([]);
    setBulkActionType(null);
  };

  const handleActionSubmit = () => {
    if (!currentAction || !actionReason) return;

    if (currentAction.action === "reject") {
      onReject(currentAction.reviewId, actionReason);
    } else if (currentAction.action === "hide") {
      onHide(currentAction.reviewId, actionReason);
    }

    setShowActionDialog(false);
    setCurrentAction(null);
    setActionReason("");
  };

  const toggleReviewSelection = (reviewId: string) => {
    setSelectedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId],
    );
  };

  const selectAllReviews = () => {
    if (selectedReviews.length === filteredReviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(filteredReviews.map((r) => r.id));
    }
  };

  const renderReviewCard = (review: Review) => {
    const priority = getPriorityLevel(review);
    const isSelected = selectedReviews.includes(review.id);

    return (
      <Card
        key={review.id}
        className={cn("transition-all", isSelected && "ring-2 ring-primary")}
      >
        <CardContent className="pt-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleReviewSelection(review.id)}
                />
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {review.isAnonymous
                      ? "?"
                      : review.studentName?.charAt(0) || "S"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">
                      {review.isAnonymous
                        ? "Anonymous Student"
                        : review.studentName}
                    </h4>
                    {getPriorityBadge(priority)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {format(parseISO(review.createdAt), "MMM d, yyyy")}
                    </span>
                    <span>•</span>
                    <span>Teacher: {review.teacherName}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusBadge(review)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleSingleAction(review.id, "approve")}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSingleAction(review.id, "hide")}
                    >
                      <EyeOff className="w-4 h-4 mr-2" />
                      Hide
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSingleAction(review.id, "reject")}
                      className="text-red-600"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </DropdownMenuItem>
                    <Separator />
                    <DropdownMenuItem
                      onClick={() =>
                        onSuspendUser(
                          review.studentId,
                          "Inappropriate review content",
                        )
                      }
                      className="text-red-600"
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Suspend User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-4 h-4",
                      star <= review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300",
                    )}
                  />
                ))}
              </div>
              <span className="font-medium">{review.rating}/5</span>
            </div>

            {/* Review Content */}
            {review.title && <h3 className="font-semibold">{review.title}</h3>}
            {review.content && (
              <p className="text-sm leading-relaxed">{review.content}</p>
            )}

            {/* Tags */}
            {review.tags && review.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {review.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Report Information */}
            {review.isReported && review.reportReason && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Reported for:</strong> {review.reportReason}
                </AlertDescription>
              </Alert>
            )}

            {/* Moderation Notes */}
            {review.moderationNotes && (
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Moderation Notes:</strong> {review.moderationNotes}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <div className={cn("space-y-6", className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Review Moderation</h2>
            <p className="text-muted-foreground">
              Manage and moderate user reviews across the platform
            </p>
          </div>

          {selectedReviews.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">{selectedReviews.length} selected</Badge>
              <Select
                value={bulkActionType || ""}
                onValueChange={setBulkActionType}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Bulk action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approve">Approve All</SelectItem>
                  <SelectItem value="hide">Hide All</SelectItem>
                  <SelectItem value="reject">Reject All</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleBulkAction}
                disabled={!bulkActionType}
                size="sm"
              >
                Apply
              </Button>
            </div>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value: any) =>
                    setFilters((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="reported">Reported</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Rating</Label>
                <Select
                  value={filters.rating}
                  onValueChange={(value: any) =>
                    setFilters((prev) => ({ ...prev, rating: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Priority</Label>
                <Select
                  value={filters.priority}
                  onValueChange={(value: any) =>
                    setFilters((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={selectAllReviews}
                  variant="outline"
                  className="w-full"
                >
                  {selectedReviews.length === filteredReviews.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-muted-foreground">Pending</span>
              </div>
              <p className="text-2xl font-bold">
                {
                  reviews.filter((r) => r.isReported && !r.moderationStatus)
                    .length
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-red-600" />
                <span className="text-sm text-muted-foreground">Reported</span>
              </div>
              <p className="text-2xl font-bold">
                {reviews.filter((r) => r.isReported).length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-muted-foreground">Approved</span>
              </div>
              <p className="text-2xl font-bold">
                {
                  reviews.filter((r) => r.moderationStatus === "approved")
                    .length
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-muted-foreground">Rejected</span>
              </div>
              <p className="text-2xl font-bold">
                {
                  reviews.filter((r) => r.moderationStatus === "rejected")
                    .length
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <Card>
              <CardContent className="pt-8 pb-8 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No reviews found</h3>
                <p className="text-muted-foreground">
                  No reviews match your current filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredReviews.map(renderReviewCard)
          )}
        </div>
      </div>

      {/* Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentAction?.action === "reject"
                ? "Reject Review"
                : "Hide Review"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please provide a reason for this moderation action. This will be
                logged for audit purposes.
              </AlertDescription>
            </Alert>

            <div>
              <Label>Reason *</Label>
              <Textarea
                placeholder="Explain why this review is being moderated..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowActionDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleActionSubmit}
                disabled={!actionReason.trim()}
                variant={
                  currentAction?.action === "reject" ? "destructive" : "default"
                }
              >
                {currentAction?.action === "reject"
                  ? "Reject Review"
                  : "Hide Review"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ReviewModeration;
