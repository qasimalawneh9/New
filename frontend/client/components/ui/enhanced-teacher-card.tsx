import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./button";
import { Badge } from "./badge";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Card, CardContent, CardHeader } from "./card";
import {
  Star,
  Clock,
  MessageCircle,
  Video,
  Globe,
  Heart,
  Play,
  Calendar,
  Award,
  Users,
  BookOpen,
  Zap,
  CheckCircle,
  MapPin,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Separator } from "./separator";
import { Progress } from "./progress";
import { Teacher } from "@shared/api";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface EnhancedTeacherCardProps {
  teacher: Teacher & {
    profileImage?: string;
    videoIntroUrl?: string;
    certifications?: string[];
    completedLessons?: number;
    responseTime?: string;
    isOnline?: boolean;
    lastActive?: string;
    studentRetentionRate?: number;
    trialAvailable?: boolean;
  };
  onFavorite?: (teacherId: string) => void;
  onMessage?: (teacherId: string) => void;
  onBook?: (teacherId: string) => void;
  onTrialBook?: (teacherId: string) => void;
  isFavorite?: boolean;
  showFullInfo?: boolean;
  className?: string;
}

export function EnhancedTeacherCard({
  teacher,
  onFavorite,
  onMessage,
  onBook,
  onTrialBook,
  isFavorite = false,
  showFullInfo = true,
  className,
}: EnhancedTeacherCardProps) {
  const { t } = useLanguage();
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const getFlagEmoji = (country: string) => {
    const flags: Record<string, string> = {
      "United States": "🇺🇸",
      "United Kingdom": "🇬🇧",
      Canada: "🇨🇦",
      Australia: "🇦🇺",
      Spain: "🇪🇸",
      France: "🇫🇷",
      Germany: "🇩🇪",
      Italy: "🇮🇹",
      Portugal: "🇵🇹",
      Brazil: "🇧🇷",
      Mexico: "🇲🇽",
      Russia: "🇷🇺",
      China: "🇨🇳",
      Japan: "🇯🇵",
      "South Korea": "🇰🇷",
      India: "🇮🇳",
      Netherlands: "🇳🇱",
      Sweden: "🇸🇪",
      Norway: "🇳🇴",
      Denmark: "🇩🇰",
      Finland: "🇫🇮",
      "Saudi Arabia": "🇸🇦",
      UAE: "🇦🇪",
    };
    return flags[country] || "🌍";
  };

  const formatResponseTime = (time?: string) => {
    if (!time) return "Usually responds within 24 hours";
    return `Usually responds ${time}`;
  };

  const getOnlineStatus = () => {
    if (teacher.isOnline) {
      return {
        status: "Online",
        color: "bg-green-500",
        text: "text-green-600",
      };
    }
    if (teacher.lastActive) {
      const lastActiveDate = new Date(teacher.lastActive);
      const now = new Date();
      const diffHours = Math.floor(
        (now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60),
      );
      if (diffHours < 24) {
        return {
          status: `Active ${diffHours}h ago`,
          color: "bg-orange-500",
          text: "text-orange-600",
        };
      }
    }
    return {
      status: "Offline",
      color: "bg-gray-400",
      text: "text-gray-500",
    };
  };

  const onlineStatus = getOnlineStatus();

  return (
    <Card
      className={cn(
        "group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-md hover:shadow-2xl hover:-translate-y-1",
        className,
      )}
    >
      {/* Header with Avatar and Status */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-16 w-16 ring-2 ring-primary/10">
                <AvatarImage
                  src={teacher.profileImage || "/placeholder-avatar.jpg"}
                  alt={teacher.name}
                />
                <AvatarFallback className="text-lg font-semibold">
                  {teacher.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white",
                  onlineStatus.color,
                )}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg leading-tight">
                  {teacher.name}
                </h3>
                {teacher.certifications &&
                  teacher.certifications.length > 0 && (
                    <Award className="h-4 w-4 text-primary" />
                  )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className={onlineStatus.text}>{onlineStatus.status}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {getFlagEmoji(teacher.country)} {teacher.country}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "transition-colors",
              isFavorite && "text-red-500 hover:text-red-600",
            )}
            onClick={() => onFavorite?.(teacher.id)}
          >
            <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Rating and Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-4 w-4",
                    star <= teacher.rating
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300",
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-medium ml-1">
              {teacher.rating.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              ({teacher.completedLessons || 0} lessons)
            </span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary">
              ${teacher.price || teacher.hourlyRate || 25}
              <span className="text-sm font-normal text-muted-foreground">
                /hour
              </span>
            </div>
            {teacher.trialAvailable && (
              <div className="text-xs text-green-600 font-medium">
                Trial: $5
              </div>
            )}
          </div>
        </div>

        {/* Languages */}
        <div>
          <div className="flex items-center gap-1 mb-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Languages</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {teacher.languages?.slice(0, 3).map((language) => (
              <Badge key={language} variant="secondary" className="text-xs">
                {language}
              </Badge>
            ))}
            {teacher.languages && teacher.languages.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{teacher.languages.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Specializations */}
        {(teacher.specializations || teacher.specialties) &&
          (teacher.specializations || teacher.specialties).length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Specializations</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {(teacher.specializations || teacher.specialties)
                  .slice(0, 2)
                  .map((spec) => (
                    <Badge key={spec} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                {(teacher.specializations || teacher.specialties).length >
                  2 && (
                  <Badge variant="outline" className="text-xs">
                    +
                    {(teacher.specializations || teacher.specialties).length -
                      2}{" "}
                    more
                  </Badge>
                )}
              </div>
            </div>
          )}

        {/* Bio Preview */}
        <div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {teacher.bio ||
              "Experienced language teacher passionate about helping students achieve their goals."}
          </p>
        </div>

        {showFullInfo && (
          <>
            <Separator />

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-primary">
                  {teacher.completedLessons || 0}
                </div>
                <div className="text-xs text-muted-foreground">Lessons</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-primary">
                  {teacher.studentRetentionRate || 85}%
                </div>
                <div className="text-xs text-muted-foreground">Retention</div>
              </div>
            </div>

            {/* Response Time */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {formatResponseTime(teacher.responseTime)}
              </div>
            </div>
          </>
        )}

        {/* Video Introduction */}
        {teacher.videoIntroUrl && (
          <div className="relative">
            <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
              <DialogTrigger asChild>
                <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg overflow-hidden cursor-pointer group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-3 group-hover:bg-white transition-colors">
                      <Play className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge className="text-xs">
                      <Video className="h-3 w-3 mr-1" />
                      Introduction
                    </Badge>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Introduction Video - {teacher.name}</DialogTitle>
                </DialogHeader>
                <div className="aspect-video">
                  <iframe
                    src={teacher.videoIntroUrl}
                    title={`${teacher.name} Introduction Video`}
                    className="w-full h-full rounded-lg"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {teacher.trialAvailable && (
            <Button
              onClick={() => onTrialBook?.(teacher.id)}
              className="w-full bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <Zap className="h-4 w-4 mr-2" />
              Book Trial Lesson ($5)
            </Button>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => onBook?.(teacher.id)}
              variant="default"
              size="sm"
              className="flex-1"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Book Lesson
            </Button>
            <Button
              onClick={() => onMessage?.(teacher.id)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Message
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link to={`/teacher/${teacher.id}`}>
              <Users className="h-4 w-4 mr-1" />
              View Full Profile
            </Link>
          </Button>
        </div>

        {/* Certifications */}
        {teacher.certifications && teacher.certifications.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center gap-1 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-green-600">
                Certified
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {teacher.certifications.slice(0, 3).map((cert) => (
                <Badge
                  key={cert}
                  variant="outline"
                  className="text-xs border-green-200 text-green-700"
                >
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default EnhancedTeacherCard;
