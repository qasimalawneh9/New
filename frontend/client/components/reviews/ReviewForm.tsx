import React, { useState } from "react";
import {
  Star,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useAuth } from "../../contexts/AuthContext";
import { PLATFORM_CONFIG } from "../../api/config";
import { Review, Booking } from "../../types/platform";
import { cn } from "../../lib/utils";

interface ReviewFormProps {
  booking: Booking;
  teacherId: string;
  teacherName: string;
  onSubmit: (review: Partial<Review>) => void;
  onCancel: () => void;
  className?: string;
}

interface DetailedRatings {
  overall: number;
  teaching_quality: number;
  communication: number;
  preparation: number;
  patience: number;
  engagement: number;
}

interface ReviewData {
  ratings: DetailedRatings;
  title: string;
  content: string;
  tags: string[];
  isAnonymous: boolean;
  wouldRecommend: boolean;
  lessonQuality: "exceeded" | "met" | "below";
}

const ratingCategories = [
  {
    key: "overall" as const,
    label: "Overall Experience",
    description: "Your general satisfaction with the lesson",
    icon: Star,
  },
  {
    key: "teaching_quality" as const,
    label: "Teaching Quality",
    description: "How well the teacher explained concepts and guided learning",
    icon: ThumbsUp,
  },
  {
    key: "communication" as const,
    label: "Communication",
    description: "Clarity of speech, responsiveness, and interaction quality",
    icon: ThumbsUp,
  },
  {
    key: "preparation" as const,
    label: "Lesson Preparation",
    description: "How well-prepared and organized the teacher was",
    icon: CheckCircle,
  },
  {
    key: "patience" as const,
    label: "Patience & Support",
    description: "Teacher's patience and willingness to help with difficulties",
    icon: ThumbsUp,
  },
  {
    key: "engagement" as const,
    label: "Engagement",
    description: "How engaging and motivating the lesson was",
    icon: Star,
  },
];

const positiveAspects = [
  "Patient and understanding",
  "Clear explanations",
  "Well-prepared lessons",
  "Engaging teaching style",
  "Good conversation skills",
  "Flexible with schedule",
  "Encouraging and motivating",
  "Uses helpful materials",
  "Good pronunciation",
  "Cultural insights",
  "Homework and feedback",
  "Professional approach",
];

const improvementAreas = [
  "Could speak slower",
  "More interactive activities",
  "Better audio/video quality",
  "More structured lessons",
  "Additional practice materials",
  "More time for questions",
  "Clearer instructions",
  "Better time management",
  "More cultural context",
  "Different teaching methods",
];

export function ReviewForm({
  booking,
  teacherId,
  teacherName,
  onSubmit,
  onCancel,
  className,
}: ReviewFormProps) {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState("ratings");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [reviewData, setReviewData] = useState<ReviewData>({
    ratings: {
      overall: 0,
      teaching_quality: 0,
      communication: 0,
      preparation: 0,
      patience: 0,
      engagement: 0,
    },
    title: "",
    content: "",
    tags: [],
    isAnonymous: false,
    wouldRecommend: false,
    lessonQuality: "met",
  });

  const updateRating = (category: keyof DetailedRatings, rating: number) => {
    setReviewData((prev) => ({
      ...prev,
      ratings: { ...prev.ratings, [category]: rating },
    }));
  };

  const toggleTag = (tag: string) => {
    setReviewData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const canSubmit = () => {
    return (
      reviewData.ratings.overall > 0 &&
      Object.values(reviewData.ratings).every((rating) => rating > 0)
    );
  };

  const handleSubmit = async () => {
    if (!canSubmit()) return;

    setIsSubmitting(true);
    try {
      const review: Partial<Review> = {
        bookingId: booking.id,
        teacherId,
        studentId: user?.id,
        rating: reviewData.ratings.overall,
        comment: reviewData.content.trim(),
        tags: reviewData.tags,
        isAnonymous: reviewData.isAnonymous,
        isPublic: true,
        // Additional metadata
        detailedRatings: reviewData.ratings,
        title: reviewData.title.trim(),
        wouldRecommend: reviewData.wouldRecommend,
        lessonQuality: reviewData.lessonQuality,
      };

      await onSubmit(review);
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOverallRating = () => {
    const ratings = Object.values(reviewData.ratings).filter((r) => r > 0);
    if (ratings.length === 0) return 0;
    return Math.round(
      ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length,
    );
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    if (rating >= 2) return "text-orange-600";
    return "text-red-600";
  };

  const renderStarRating = (
    rating: number,
    onRatingChange: (rating: number) => void,
    category?: string,
  ) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="focus:outline-none focus:ring-2 focus:ring-primary rounded"
          >
            <Star
              className={cn(
                "w-6 h-6 transition-colors cursor-pointer",
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 hover:text-yellow-200",
              )}
            />
          </button>
        ))}
        <span
          className={cn("ml-2 text-sm font-medium", getRatingColor(rating))}
        >
          {rating > 0 && (
            <>
              {rating}/5
              {rating >= 4 && " Excellent"}
              {rating === 3 && " Good"}
              {rating === 2 && " Fair"}
              {rating === 1 && " Poor"}
            </>
          )}
        </span>
      </div>
    );
  };

  return (
    <Card className={cn("max-w-4xl mx-auto", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5" />
          Review Your Lesson with {teacherName}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Lesson on {booking.date} • {booking.duration} minutes • Help other
          students by sharing your experience
        </p>
      </CardHeader>

      <CardContent>
        <Tabs
          value={currentTab}
          onValueChange={setCurrentTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ratings">Ratings</TabsTrigger>
            <TabsTrigger value="feedback">Written Feedback</TabsTrigger>
            <TabsTrigger value="privacy">Privacy & Submit</TabsTrigger>
          </TabsList>

          <TabsContent value="ratings" className="space-y-6 mt-6">
            <Alert>
              <HelpCircle className="h-4 w-4" />
              <AlertDescription>
                Please rate different aspects of your lesson. Your honest
                feedback helps improve the platform for everyone.
              </AlertDescription>
            </Alert>

            {/* Overall Rating Summary */}
            <Card className="bg-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Overall Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold">
                    {getOverallRating()}/5
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "w-6 h-6",
                          star <= getOverallRating()
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300",
                        )}
                      />
                    ))}
                  </div>
                  <Badge
                    variant="outline"
                    className={getRatingColor(getOverallRating())}
                  >
                    {getOverallRating() >= 4 && "Excellent"}
                    {getOverallRating() === 3 && "Good"}
                    {getOverallRating() === 2 && "Fair"}
                    {getOverallRating() === 1 && "Poor"}
                    {getOverallRating() === 0 && "Not Rated"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Ratings */}
            <div className="space-y-4">
              {ratingCategories.map((category) => (
                <Card key={category.key}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <category.icon className="w-4 h-4" />
                          <Label className="font-medium">
                            {category.label}
                          </Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="w-3 h-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  {category.description}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          {category.description}
                        </p>
                        {renderStarRating(
                          reviewData.ratings[category.key],
                          (rating) => updateRating(category.key, rating),
                          category.key,
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Lesson Quality Assessment */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Lesson Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <Label className="text-base font-medium mb-3 block">
                  Did this lesson meet your expectations?
                </Label>
                <RadioGroup
                  value={reviewData.lessonQuality}
                  onValueChange={(value: "exceeded" | "met" | "below") =>
                    setReviewData((prev) => ({ ...prev, lessonQuality: value }))
                  }
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="exceeded" id="exceeded" />
                    <Label
                      htmlFor="exceeded"
                      className="flex items-center gap-2"
                    >
                      <ThumbsUp className="w-4 h-4 text-green-600" />
                      Exceeded expectations - better than I hoped
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="met" id="met" />
                    <Label htmlFor="met" className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      Met expectations - as good as expected
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="below" id="below" />
                    <Label htmlFor="below" className="flex items-center gap-2">
                      <ThumbsDown className="w-4 h-4 text-red-600" />
                      Below expectations - could have been better
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Recommendation */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recommend"
                    checked={reviewData.wouldRecommend}
                    onCheckedChange={(checked) =>
                      setReviewData((prev) => ({
                        ...prev,
                        wouldRecommend: !!checked,
                      }))
                    }
                  />
                  <Label htmlFor="recommend" className="text-base font-medium">
                    I would recommend this teacher to other students
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6 mt-6">
            {/* Title */}
            <div>
              <Label className="text-base font-medium mb-2 block">
                Review Title (Optional)
              </Label>
              <input
                type="text"
                placeholder="Summarize your experience in a few words..."
                value={reviewData.title}
                onChange={(e) =>
                  setReviewData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {reviewData.title.length}/100 characters
              </p>
            </div>

            {/* Written Review */}
            <div>
              <Label className="text-base font-medium mb-2 block">
                Detailed Review (Optional)
              </Label>
              <Textarea
                placeholder="Share your experience with this teacher. What did you learn? What could be improved?"
                value={reviewData.content}
                onChange={(e) =>
                  setReviewData((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                rows={6}
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {reviewData.content.length}/1000 characters
              </p>
            </div>

            {/* Positive Aspects Tags */}
            <div>
              <Label className="text-base font-medium mb-3 block">
                What did you like most? (Select all that apply)
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {positiveAspects.map((aspect) => (
                  <Badge
                    key={aspect}
                    variant={
                      reviewData.tags.includes(aspect) ? "default" : "outline"
                    }
                    className="cursor-pointer justify-center p-2 text-center"
                    onClick={() => toggleTag(aspect)}
                  >
                    {aspect}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Improvement Areas */}
            {reviewData.ratings.overall < 4 && (
              <div>
                <Label className="text-base font-medium mb-3 block">
                  Areas for improvement (Select all that apply)
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {improvementAreas.map((area) => (
                    <Badge
                      key={area}
                      variant={
                        reviewData.tags.includes(area)
                          ? "destructive"
                          : "outline"
                      }
                      className="cursor-pointer justify-center p-2 text-center"
                      onClick={() => toggleTag(area)}
                    >
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6 mt-6">
            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anonymous"
                    checked={reviewData.isAnonymous}
                    onCheckedChange={(checked) =>
                      setReviewData((prev) => ({
                        ...prev,
                        isAnonymous: !!checked,
                      }))
                    }
                  />
                  <Label
                    htmlFor="anonymous"
                    className="flex items-center gap-2"
                  >
                    {reviewData.isAnonymous ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    Post anonymously
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  {reviewData.isAnonymous
                    ? "Your name will not be shown with this review"
                    : "Your name will be displayed with this review"}
                </p>
              </CardContent>
            </Card>

            {/* Review Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Review Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>Overall Rating:</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "w-4 h-4",
                              star <= getOverallRating()
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300",
                            )}
                          />
                        ))}
                      </div>
                      <span className="font-medium">
                        {getOverallRating()}/5
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label>Would Recommend:</Label>
                    <p className="mt-1 font-medium">
                      {reviewData.wouldRecommend ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                {reviewData.title && (
                  <div>
                    <Label>Title:</Label>
                    <p className="mt-1">{reviewData.title}</p>
                  </div>
                )}

                {reviewData.content && (
                  <div>
                    <Label>Review:</Label>
                    <p className="mt-1 text-sm">{reviewData.content}</p>
                  </div>
                )}

                {reviewData.tags.length > 0 && (
                  <div>
                    <Label>Tags:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {reviewData.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Legal Notice */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Review Guidelines:</strong> Please be honest and
                constructive. Reviews are moderated and inappropriate content
                will be removed. False or defamatory reviews may result in
                account suspension.
              </AlertDescription>
            </Alert>

            {/* Submit Actions */}
            <div className="flex gap-3 pt-4">
              <Button onClick={onCancel} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit() || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default ReviewForm;
