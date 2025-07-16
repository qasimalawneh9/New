import React, { useState } from "react";
import {
  Star,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Users,
  MessageSquare,
  Award,
  AlertTriangle,
  Filter,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { ReviewStats } from "../../types/platform";
import { format, subDays, subMonths } from "date-fns";
import { cn } from "../../lib/utils";

interface ReviewAnalyticsProps {
  teacherId?: string;
  stats: ReviewStats & {
    monthlyTrends?: Array<{
      month: string;
      averageRating: number;
      totalReviews: number;
      responseRate: number;
    }>;
    categoryBreakdown?: Record<string, number>;
    comparisonData?: {
      platformAverage: number;
      rankPercentile: number;
      improvementAreas: string[];
      strengths: string[];
    };
  };
  userRole: "teacher" | "admin";
  timeRange: "week" | "month" | "quarter" | "year";
  onTimeRangeChange: (range: "week" | "month" | "quarter" | "year") => void;
  className?: string;
}

interface InsightCard {
  title: string;
  value: string | number;
  change?: number;
  changeType?: "positive" | "negative" | "neutral";
  description: string;
  icon: React.ElementType;
  color: string;
}

export function ReviewAnalytics({
  teacherId,
  stats,
  userRole,
  timeRange,
  onTimeRangeChange,
  className,
}: ReviewAnalyticsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Calculate insights
  const getInsights = (): InsightCard[] => {
    const insights: InsightCard[] = [
      {
        title: "Average Rating",
        value: stats.averageRating.toFixed(1),
        change: 0.2, // Mock data - would be calculated from trends
        changeType: "positive",
        description: `Based on ${stats.totalReviews} reviews`,
        icon: Star,
        color: "text-yellow-600",
      },
      {
        title: "Total Reviews",
        value: stats.totalReviews,
        change: 15, // Mock data
        changeType: "positive",
        description: `${timeRange} period`,
        icon: MessageSquare,
        color: "text-blue-600",
      },
      {
        title: "Response Rate",
        value: "87%", // Mock data
        change: -5,
        changeType: "negative",
        description: "Percentage of reviews with teacher responses",
        icon: Users,
        color: "text-green-600",
      },
      {
        title: "Platform Ranking",
        value: "Top 15%", // Mock data
        change: 3,
        changeType: "positive",
        description: "Among all teachers",
        icon: Award,
        color: "text-purple-600",
      },
    ];

    if (userRole === "admin") {
      insights.push({
        title: "Reported Reviews",
        value: "3", // Mock data
        change: -2,
        changeType: "positive",
        description: "Requiring moderation",
        icon: AlertTriangle,
        color: "text-red-600",
      });
    }

    return insights;
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4.0) return "text-blue-600";
    if (rating >= 3.5) return "text-yellow-600";
    if (rating >= 3.0) return "text-orange-600";
    return "text-red-600";
  };

  const getPerformanceBadge = (rating: number) => {
    if (rating >= 4.5)
      return { label: "Excellent", variant: "default" as const };
    if (rating >= 4.0)
      return { label: "Very Good", variant: "secondary" as const };
    if (rating >= 3.5) return { label: "Good", variant: "outline" as const };
    if (rating >= 3.0)
      return { label: "Fair", variant: "destructive" as const };
    return { label: "Needs Improvement", variant: "destructive" as const };
  };

  const insights = getInsights();
  const performanceBadge = getPerformanceBadge(stats.averageRating);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Review Analytics</h2>
          <p className="text-muted-foreground">
            {userRole === "teacher"
              ? "Your review performance insights"
              : "Platform review overview"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {insight.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">{insight.value}</p>
                      {insight.change !== undefined && (
                        <Badge
                          variant={
                            insight.changeType === "positive"
                              ? "default"
                              : insight.changeType === "negative"
                                ? "destructive"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {insight.changeType === "positive" ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : insight.changeType === "negative" ? (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          ) : null}
                          {Math.abs(insight.change)}%
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {insight.description}
                    </p>
                  </div>
                  <Icon className={cn("w-8 h-8", insight.color)} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Performance Overview
            </span>
            <Badge variant={performanceBadge.variant}>
              {performanceBadge.label}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rating Distribution */}
            <div>
              <h4 className="font-semibold mb-4">Rating Distribution</h4>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats.ratingDistribution[rating] || 0;
                  const percentage =
                    stats.totalReviews > 0
                      ? (count / stats.totalReviews) * 100
                      : 0;

                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm">{rating}</span>
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      </div>
                      <Progress value={percentage} className="flex-1" />
                      <div className="flex items-center gap-2 w-20">
                        <span className="text-sm font-medium">{count}</span>
                        <span className="text-xs text-muted-foreground">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Breakdown */}
            <div>
              <h4 className="font-semibold mb-4">Category Performance</h4>
              <div className="space-y-3">
                {[
                  { name: "Teaching Quality", score: 4.6, total: 5 },
                  { name: "Communication", score: 4.4, total: 5 },
                  { name: "Preparation", score: 4.7, total: 5 },
                  { name: "Patience", score: 4.5, total: 5 },
                  { name: "Engagement", score: 4.3, total: 5 },
                ].map((category) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">{category.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "w-3 h-3",
                              star <= category.score
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300",
                            )}
                          />
                        ))}
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          getPerformanceColor(category.score),
                        )}
                      >
                        {category.score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rating Trends</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Mock trend data - in real app this would be a chart */}
              <div className="space-y-4">
                {stats.monthlyTrends?.slice(0, 6).map((trend, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{trend.month}</p>
                      <p className="text-sm text-muted-foreground">
                        {trend.totalReviews} reviews • {trend.responseRate}%
                        response rate
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">
                          {trend.averageRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                )) || (
                  <p className="text-center text-muted-foreground py-8">
                    No trend data available for the selected period
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Common Feedback Themes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Positive Feedback */}
                <div>
                  <h4 className="font-semibold text-green-600 mb-3">
                    Most Praised Aspects
                  </h4>
                  <div className="space-y-2">
                    {stats.commonTags.slice(0, 8).map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600"
                        >
                          {tag}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {Math.floor(Math.random() * 20) + 10}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Areas for Improvement */}
                <div>
                  <h4 className="font-semibold text-orange-600 mb-3">
                    Improvement Opportunities
                  </h4>
                  <div className="space-y-2">
                    {[
                      "More interactive activities",
                      "Better audio quality",
                      "Clearer explanations",
                      "More practice time",
                    ].map((area, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <Badge
                          variant="outline"
                          className="text-orange-600 border-orange-600"
                        >
                          {area}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {Math.floor(Math.random() * 15) + 5}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Platform Comparison */}
                <div>
                  <h4 className="font-semibold mb-3">Platform Benchmarks</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Your Rating
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {stats.averageRating.toFixed(1)}
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Platform Average
                      </p>
                      <p className="text-2xl font-bold text-gray-600">4.2</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Top 10% Threshold
                      </p>
                      <p className="text-2xl font-bold text-green-600">4.8</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Ranking */}
                <div>
                  <h4 className="font-semibold mb-3">Your Ranking</h4>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span>Top 15% of all teachers</span>
                      <Badge variant="default">Excellent</Badge>
                    </div>
                    <Progress value={85} className="mb-2" />
                    <p className="text-sm text-muted-foreground">
                      You rank higher than 85% of teachers on the platform
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI-Generated Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="font-medium text-blue-900">
                    Strong Performance
                  </p>
                  <p className="text-sm text-blue-800">
                    Your patience and communication skills are consistently
                    praised by students.
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <p className="font-medium text-green-900">
                    Growth Opportunity
                  </p>
                  <p className="text-sm text-green-800">
                    Consider adding more interactive elements to boost
                    engagement scores.
                  </p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <p className="font-medium text-orange-900">Trend Alert</p>
                  <p className="text-sm text-orange-800">
                    Your response rate has decreased by 12% this month.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recommended Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Respond to recent reviews</p>
                    <p className="text-sm text-muted-foreground">
                      3 reviews from this week are awaiting your response
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Improve lesson materials</p>
                    <p className="text-sm text-muted-foreground">
                      Students appreciate well-prepared lessons - consider
                      adding more resources
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Check audio setup</p>
                    <p className="text-sm text-muted-foreground">
                      Recent feedback mentions audio quality issues
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ReviewAnalytics;
