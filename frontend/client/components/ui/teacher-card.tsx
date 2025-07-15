import { Link } from "react-router-dom";
import { Button } from "./button";
import { Badge } from "./badge";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Card, CardContent, CardFooter } from "./card";
import { Star, Clock, MessageCircle, Video, Globe } from "lucide-react";
import { Teacher } from "@shared/api";
import { cn } from "@/lib/utils";

interface TeacherCardProps {
  teacher: Teacher;
  className?: string;
}

export function TeacherCard({ teacher, className }: TeacherCardProps) {
  const flagEmoji = getFlagEmoji(teacher.country);

  // For demo purposes, create a video URL if teacher has video data
  const hasVideo = teacher.video && teacher.video.length > 0;

  return (
    <Card
      className={cn(
        "group hover:shadow-lg transition-shadow overflow-hidden",
        className,
      )}
    >
      {/* Introduction Video - Always Visible */}
      <div className="relative">
        <div className="aspect-video bg-black/5">
          {hasVideo ? (
            <iframe
              src={teacher.video}
              title={`${teacher.name} - Introduction Video`}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
              <div className="text-center">
                <Video className="h-12 w-12 mx-auto mb-3 text-primary/60" />
                <p className="text-sm text-muted-foreground">
                  Introduction video coming soon
                </p>
              </div>
            </div>
          )}
        </div>
        {/* Teacher Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="font-semibold text-lg text-white leading-tight">
            {teacher.name}
          </h3>
          <div className="flex items-center text-white/90 text-sm mt-1">
            <span className="mr-1">{flagEmoji}</span>
            <span>{teacher.country}</span>
            {teacher.isOnline && (
              <Badge
                variant="outline"
                className="ml-2 text-xs border-white/30 text-white/90"
              >
                Online
              </Badge>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Price */}
        <div className="text-right mb-4">
          <div className="text-2xl font-bold text-primary">
            ${teacher.price}
          </div>
          <div className="text-sm text-muted-foreground">per lesson</div>
        </div>

        {/* Languages */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="default" className="bg-primary/10 text-primary">
              {teacher.nativeLanguage} (Native)
            </Badge>
            {teacher.languages.slice(0, 2).map((lang) => (
              <Badge key={lang} variant="outline">
                {lang}
              </Badge>
            ))}
            {teacher.languages.length > 2 && (
              <Badge variant="outline">
                +{teacher.languages.length - 2} more
              </Badge>
            )}
          </div>
        </div>

        {/* Rating and Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-medium">{teacher.rating}</span>
              <span className="text-muted-foreground text-sm ml-1">
                ({teacher.reviewCount})
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>{teacher.completedLessons} lessons</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Responds in {teacher.responseTime}
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {teacher.specialties.slice(0, 3).map((specialty) => (
              <Badge key={specialty} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {teacher.description}
        </p>

        {/* Badges */}
        {teacher.badges.length > 0 && (
          <div className="flex items-center space-x-2 mb-4">
            {teacher.badges.slice(0, 2).map((badge) => (
              <Badge
                key={badge}
                variant="outline"
                className="text-xs bg-accent/50"
              >
                {badge}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0 flex space-x-2">
        <Button variant="outline" size="sm" className="flex-1">
          <MessageCircle className="h-4 w-4 mr-2" />
          Message
        </Button>
        <Button size="sm" className="flex-1" asChild>
          <Link to={`/teachers/${teacher.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function getFlagEmoji(country: string): string {
  const flagMap: Record<string, string> = {
    "United States": "🇺🇸",
    "United Kingdom": "🇬🇧",
    Canada: "🇨🇦",
    Australia: "🇦🇺",
    Spain: "🇪🇸",
    France: "🇫🇷",
    Germany: "🇩🇪",
    Italy: "🇮🇹",
    China: "🇨🇳",
    Japan: "🇯🇵",
    "South Korea": "🇰🇷",
    Brazil: "🇧🇷",
    Mexico: "🇲🇽",
    Argentina: "🇦🇷",
    Russia: "🇷🇺",
    Netherlands: "🇳🇱",
    Sweden: "🇸🇪",
    Norway: "🇳🇴",
    Denmark: "🇩🇰",
    Poland: "🇵🇱",
  };
  return flagMap[country] || "🌍";
}
