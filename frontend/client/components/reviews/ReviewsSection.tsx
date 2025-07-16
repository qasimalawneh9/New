import React, { useState, useEffect } from "react";
import { Star, ThumbsUp, MessageSquare, Clock, Filter } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { Review, ReviewStats, User } from "../../types/platform";
import { cn } from "../../lib/utils";
import { format } from "date-fns";

interface ReviewsSectionProps {
  teacherId: string;
  reviews: Review[];
  stats: ReviewStats;
  currentUser?: User;
  canReview?: boolean;
  onSubmitReview?: (review: Partial<Review>) => void;
  className?: string;
}

export function ReviewsSection({
  teacherId,
  reviews,
  stats,
  currentUser,
  canReview = false,
  onSubmitReview,
  className,
}: ReviewsSectionProps) {
  const [filterRating, setFilterRating] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [showReviewForm, setShowReviewForm] = useState(false);

  const filteredReviews = reviews
    .filter((review) => {
      if (filterRating === "all") return true;
      return review.rating === parseInt(filterRating);
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

  return (
    <div className={cn("space-y-6", className)}>
      {/* Reviews Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Reviews & Ratings</span>
            {canReview && (
              <Button
                onClick={() => setShowReviewForm(true)}
                disabled={showReviewForm}
              >
                Write Review
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rating Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center">
                <StarRating rating={stats.averageRating} size="lg" />
              </div>
              <p className="text-muted-foreground">
                Based on {stats.totalReviews} reviews
              </p>
            </div>

            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm w-8">{star} ⭐</span>
                  <Progress
                    value={
                      ((stats.ratingDistribution[star] || 0) /
                        stats.totalReviews) *
                      100
                    }
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-8">
                    {stats.ratingDistribution[star] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Common Tags */}
          {stats.commonTags.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Common Tags</h4>
              <div className="flex flex-wrap gap-2">
                {stats.commonTags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Form */}
      {showReviewForm && canReview && onSubmitReview && (
        <ReviewForm
          teacherId={teacherId}
          onSubmit={(review) => {
            onSubmitReview(review);
            setShowReviewForm(false);
          }}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Reviews ({reviews.length})</CardTitle>
            <div className="flex gap-2">
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-32">
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
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="highest">Highest Rated</SelectItem>
                  <SelectItem value="lowest">Lowest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}

              {filteredReviews.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No reviews match your filters
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

// Sub-components
function StarRating({
  rating,
  size = "sm",
  interactive = false,
  onRatingChange,
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const displayRating = interactive ? hoveredRating || rating : rating;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            star <= displayRating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300",
            interactive &&
              "cursor-pointer hover:scale-110 transition-transform",
          )}
          onClick={interactive ? () => onRatingChange?.(star) : undefined}
          onMouseEnter={interactive ? () => setHoveredRating(star) : undefined}
          onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
        />
      ))}
    </div>
  );
}

function ReviewItem({ review }: { review: Review }) {
  // Mock user data - in real app, this would be fetched
  const reviewer = {
    name: review.isAutoGenerated ? "Anonymous" : "Student Name",
    profileImage: "",
  };

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={reviewer.profileImage} />
            <AvatarFallback>{reviewer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{reviewer.name}</h4>
              {review.isAutoGenerated && (
                <Badge variant="outline" className="text-xs">
                  Auto-generated
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} />
              <span className="text-sm text-muted-foreground">
                {format(new Date(review.createdAt), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {review.comment && (
        <p className="text-sm leading-relaxed">{review.comment}</p>
      )}

      {review.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {review.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewForm({
  teacherId,
  onSubmit,
  onCancel,
}: {
  teacherId: string;
  onSubmit: (review: Partial<Review>) => void;
  onCancel: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = [
    "Patient",
    "Knowledgeable",
    "Engaging",
    "Clear Explanation",
    "Well Prepared",
    "Flexible",
    "Encouraging",
    "Professional",
    "Fun",
    "Challenging",
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmit = () => {
    if (rating === 0) return;

    onSubmit({
      teacherId,
      rating,
      comment: comment.trim(),
      tags: selectedTags,
      isAutoGenerated: false,
      isPublic: true,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rating */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Overall Rating *
          </label>
          <StarRating
            rating={rating}
            size="lg"
            interactive
            onRatingChange={setRating}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            What made this teacher great? (optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Additional Comments (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this teacher..."
            className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {comment.length}/500 characters
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={onCancel} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="flex-1"
          >
            Submit Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ReviewsSection;
