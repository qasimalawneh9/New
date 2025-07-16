import React, { useState } from "react";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Flag,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Calendar,
  User,
  Shield,
  Reply,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Alert, AlertDescription } from "../ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAuth } from "../../contexts/AuthContext";
import { Review } from "../../types/platform";
import { format, parseISO } from "date-fns";
import { cn } from "../../lib/utils";

interface ReviewDisplayProps {
  review: Review;
  showTeacherReply?: boolean;
  canReply?: boolean;
  canModerate?: boolean;
  onReply?: (reviewId: string, reply: string) => void;
  onReport?: (reviewId: string, reason: string) => void;
  onModerate?: (
    reviewId: string,
    action: "approve" | "reject" | "hide",
  ) => void;
  onHelpful?: (reviewId: string, helpful: boolean) => void;
  className?: string;
}

interface ReportData {
  reason: string;
  category: "inappropriate" | "spam" | "fake" | "offensive" | "other";
  description: string;
}

export function ReviewDisplay({
  review,
  showTeacherReply = true,
  canReply = false,
  canModerate = false,
  onReply,
  onReport,
  onModerate,
  onHelpful,
  className,
}: ReviewDisplayProps) {
  const { user } = useAuth();
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [reportData, setReportData] = useState<ReportData>({
    reason: "",
    category: "inappropriate",
    description: "",
  });
  const [hasVoted, setHasVoted] = useState(false);
  const [helpfulVote, setHelpfulVote] = useState<boolean | null>(null);

  // Mock data - in real app this would come from props/API
  const reviewerInfo = {
    name: review.isAnonymous ? "Anonymous Student" : "Student Name",
    profileImage: review.isAnonymous ? "" : "/placeholder-avatar.jpg",
    verified: true,
    totalReviews: 12,
    memberSince: "2023",
  };

  const getVerificationBadge = () => {
    if (review.isVerified) {
      return (
        <Badge variant="secondary" className="text-xs">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      );
    }
    return null;
  };

  const getStatusBadge = () => {
    if (review.isReported) {
      return (
        <Badge variant="destructive" className="text-xs">
          <Flag className="w-3 h-3 mr-1" />
          Reported
        </Badge>
      );
    }
    if (review.isFeatured) {
      return (
        <Badge variant="default" className="text-xs">
          <Star className="w-3 h-3 mr-1" />
          Featured
        </Badge>
      );
    }
    return null;
  };

  const renderStarRating = (rating: number, size: "sm" | "md" = "sm") => {
    const sizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClass,
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300",
            )}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating}/5</span>
      </div>
    );
  };

  const handleReply = async () => {
    if (!replyText.trim() || !onReply) return;

    try {
      await onReply(review.id, replyText.trim());
      setReplyText("");
      setShowReplyDialog(false);
    } catch (error) {
      console.error("Failed to submit reply:", error);
    }
  };

  const handleReport = async () => {
    if (!reportData.reason || !onReport) return;

    try {
      await onReport(review.id, reportData.reason);
      setShowReportDialog(false);
      setReportData({
        reason: "",
        category: "inappropriate",
        description: "",
      });
    } catch (error) {
      console.error("Failed to report review:", error);
    }
  };

  const handleHelpfulVote = async (helpful: boolean) => {
    if (hasVoted || !onHelpful) return;

    try {
      await onHelpful(review.id, helpful);
      setHelpfulVote(helpful);
      setHasVoted(true);
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  return (
    <>
      <Card className={cn("w-full", className)}>
        <CardContent className="pt-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={reviewerInfo.profileImage} />
                <AvatarFallback>
                  {review.isAnonymous ? "?" : reviewerInfo.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{reviewerInfo.name}</h4>
                  {getVerificationBadge()}
                  {getStatusBadge()}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {format(parseISO(review.createdAt), "MMM d, yyyy")}
                  </span>
                  {!review.isAnonymous && (
                    <>
                      <span>•</span>
                      <span>{reviewerInfo.totalReviews} reviews</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {renderStarRating(review.rating)}

              {/* Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowReportDialog(true)}>
                    <Flag className="w-4 h-4 mr-2" />
                    Report Review
                  </DropdownMenuItem>

                  {canModerate && (
                    <>
                      <Separator />
                      <DropdownMenuItem
                        onClick={() => onModerate?.(review.id, "approve")}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onModerate?.(review.id, "hide")}
                      >
                        <EyeOff className="w-4 h-4 mr-2" />
                        Hide
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onModerate?.(review.id, "reject")}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Review Title */}
          {review.title && (
            <h3 className="font-semibold text-lg mb-2">{review.title}</h3>
          )}

          {/* Review Content */}
          {review.content && (
            <p className="text-sm leading-relaxed mb-4">{review.content}</p>
          )}

          {/* Detailed Ratings */}
          {review.detailedRatings && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Teaching</p>
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">
                    {review.detailedRatings.teaching_quality}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Communication</p>
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">
                    {review.detailedRatings.communication}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Engagement</p>
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">
                    {review.detailedRatings.engagement}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          {review.tags && review.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {review.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Lesson Quality & Recommendation */}
          {(review.lessonQuality || review.wouldRecommend) && (
            <div className="flex items-center gap-4 mb-4 text-sm">
              {review.lessonQuality && (
                <div className="flex items-center gap-1">
                  {review.lessonQuality === "exceeded" && (
                    <>
                      <ThumbsUp className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">
                        Exceeded expectations
                      </span>
                    </>
                  )}
                  {review.lessonQuality === "met" && (
                    <>
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-600">Met expectations</span>
                    </>
                  )}
                  {review.lessonQuality === "below" && (
                    <>
                      <ThumbsDown className="w-4 h-4 text-red-600" />
                      <span className="text-red-600">Below expectations</span>
                    </>
                  )}
                </div>
              )}

              {review.wouldRecommend && (
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">Would recommend</span>
                </div>
              )}
            </div>
          )}

          <Separator className="my-4" />

          {/* Teacher Reply */}
          {showTeacherReply && review.teacherReply && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">
                  Teacher Response
                </span>
                <span className="text-xs text-blue-600">
                  {format(
                    parseISO(review.teacherReply.createdAt),
                    "MMM d, yyyy",
                  )}
                </span>
              </div>
              <p className="text-sm text-blue-900 leading-relaxed">
                {review.teacherReply.content}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              {/* Helpful Votes */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleHelpfulVote(true)}
                  disabled={hasVoted}
                  className={cn(
                    "h-8 px-2",
                    helpfulVote === true && "bg-green-100 text-green-700",
                  )}
                >
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  <span className="text-xs">
                    {review.helpfulCount + (helpfulVote === true ? 1 : 0)}
                  </span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleHelpfulVote(false)}
                  disabled={hasVoted}
                  className={cn(
                    "h-8 px-2",
                    helpfulVote === false && "bg-red-100 text-red-700",
                  )}
                >
                  <ThumbsDown className="w-3 h-3 mr-1" />
                  <span className="text-xs">Not helpful</span>
                </Button>
              </div>

              {/* Reply Button */}
              {canReply && !review.teacherReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyDialog(true)}
                  className="h-8 px-2"
                >
                  <Reply className="w-3 h-3 mr-1" />
                  <span className="text-xs">Reply</span>
                </Button>
              )}
            </div>

            {/* Review Meta */}
            <div className="text-xs text-muted-foreground">
              {review.isAutoGenerated && "Auto-generated"} • Review #
              {review.id.slice(-6)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reply Dialog */}
      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <MessageSquare className="h-4 w-4" />
              <AlertDescription>
                Your reply will be public and visible to all users. Be
                professional and constructive.
              </AlertDescription>
            </Alert>

            <div>
              <Label>Your Response</Label>
              <Textarea
                placeholder="Thank the student for their feedback and address any concerns..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {replyText.length}/500 characters
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowReplyDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleReply} disabled={!replyText.trim()}>
                Post Reply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please only report reviews that violate our community
                guidelines. False reports may result in account restrictions.
              </AlertDescription>
            </Alert>

            <div>
              <Label>Report Category</Label>
              <Select
                value={reportData.category}
                onValueChange={(value: ReportData["category"]) =>
                  setReportData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inappropriate">
                    Inappropriate Content
                  </SelectItem>
                  <SelectItem value="spam">Spam or Advertisement</SelectItem>
                  <SelectItem value="fake">
                    Fake or Misleading Review
                  </SelectItem>
                  <SelectItem value="offensive">Offensive Language</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Reason for Reporting</Label>
              <Textarea
                placeholder="Please explain why you're reporting this review..."
                value={reportData.description}
                onChange={(e) =>
                  setReportData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowReportDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReport}
                variant="destructive"
                disabled={!reportData.description.trim()}
              >
                Submit Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ReviewDisplay;
