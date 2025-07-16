import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { db } from "@/lib/database";
import { useToast } from "@/components/ui/use-toast";
import {
  Calendar,
  Clock,
  Video,
  MessageCircle,
  Star,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Users,
  BookOpen,
  CheckCircle,
  XCircle,
  Edit,
} from "lucide-react";

interface Lesson {
  id: string;
  teacherName: string;
  teacherAvatar: string;
  language: string;
  date: string;
  time: string;
  duration: number;
  status: "upcoming" | "completed" | "cancelled";
  type: "trial" | "regular" | "group";
  topic: string;
  rating?: number;
  notes?: string;
}

const mockLessons: Lesson[] = [
  {
    id: "LSN_001",
    teacherName: "María García",
    teacherAvatar: "/placeholder.svg",
    language: "Spanish",
    date: "2024-01-25",
    time: "14:00",
    duration: 60,
    status: "upcoming",
    type: "regular",
    topic: "Conversational Spanish - Travel Vocabulary",
  },
  {
    id: "LSN_002",
    teacherName: "Pierre Dubois",
    teacherAvatar: "/placeholder.svg",
    language: "French",
    date: "2024-01-23",
    time: "16:30",
    duration: 90,
    status: "completed",
    type: "trial",
    topic: "French Pronunciation Basics",
    rating: 5,
    notes: "Great first lesson! Looking forward to continuing.",
  },
  {
    id: "LSN_003",
    teacherName: "Anna Schmidt",
    teacherAvatar: "/placeholder.svg",
    language: "German",
    date: "2024-01-22",
    time: "10:00",
    duration: 60,
    status: "completed",
    type: "regular",
    topic: "Business German - Email Writing",
    rating: 4,
    notes: "Helpful lesson on formal communication.",
  },
  {
    id: "LSN_004",
    teacherName: "Yuki Tanaka",
    teacherAvatar: "/placeholder.svg",
    language: "Japanese",
    date: "2024-01-20",
    time: "09:00",
    duration: 60,
    status: "cancelled",
    type: "group",
    topic: "Japanese Grammar - Particles",
  },
];

const upcomingLessons = mockLessons.filter(
  (lesson) => lesson.status === "upcoming",
);
const completedLessons = mockLessons.filter(
  (lesson) => lesson.status === "completed",
);
const cancelledLessons = mockLessons.filter(
  (lesson) => lesson.status === "cancelled",
);

export default function DashboardLessons() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();

  const handleJoinLesson = (lessonId: string) => {
    const meetingInfo = db.getLessonMeetingInfo(lessonId);
    if (meetingInfo) {
      window.open(meetingInfo.meetingUrl, "_blank");
      toast({
        title: "Joining Lesson",
        description: `${meetingInfo.platformName} opened in new tab with ${meetingInfo.teacherName}`,
      });
    } else {
      toast({
        title: "Error",
        description: "Unable to find lesson meeting information",
        variant: "destructive",
      });
    }
  };

  const handleRescheduleLesson = (lessonId: string) => {
    console.log("Rescheduling lesson:", lessonId);
    // In a real app, this would open a reschedule dialog
  };

  const handleCancelLesson = (lessonId: string) => {
    console.log("Cancelling lesson:", lessonId);
    // In a real app, this would show a cancellation confirmation
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const lessonDate = new Date(dateString);
    return (
      today.getDate() === lessonDate.getDate() &&
      today.getMonth() === lessonDate.getMonth() &&
      today.getFullYear() === lessonDate.getFullYear()
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Lessons</h1>
            <p className="text-muted-foreground">
              Manage your language learning sessions
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link to="/teachers">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Book New Lesson
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold">{upcomingLessons.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">
                    {completedLessons.length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold">24.5</p>
                </div>
                <BookOpen className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterLanguage} onValueChange={setFilterLanguage}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Languages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
              <SelectItem value="french">French</SelectItem>
              <SelectItem value="german">German</SelectItem>
              <SelectItem value="japanese">Japanese</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lessons Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingLessons.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedLessons.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledLessons.length})
            </TabsTrigger>
            <TabsTrigger value="all">All Lessons</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingLessons.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No upcoming lessons
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Book a lesson with your favorite teacher to get started
                  </p>
                  <Link to="/teachers">
                    <Button>Browse Teachers</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingLessons.map((lesson) => (
                  <Card
                    key={lesson.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={lesson.teacherAvatar}
                              alt={lesson.teacherName}
                            />
                            <AvatarFallback>
                              {lesson.teacherName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold">
                                {lesson.teacherName}
                              </h3>
                              <Badge variant="outline">{lesson.language}</Badge>
                              <Badge
                                variant={
                                  lesson.type === "trial"
                                    ? "secondary"
                                    : "default"
                                }
                              >
                                {lesson.type}
                              </Badge>
                              {isToday(lesson.date) && (
                                <Badge className="bg-orange-500">Today</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {lesson.topic}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(lesson.date)}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {lesson.time} ({lesson.duration} min)
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleJoinLesson(lesson.id)}
                            disabled={!isToday(lesson.date)}
                          >
                            <Video className="w-4 h-4 mr-2" />
                            {isToday(lesson.date) ? "Join" : "Scheduled"}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRescheduleLesson(lesson.id)
                                }
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Reschedule
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Message Teacher
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleCancelLesson(lesson.id)}
                                className="text-red-600"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Cancel Lesson
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedLessons.map((lesson) => (
              <Card
                key={lesson.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={lesson.teacherAvatar}
                          alt={lesson.teacherName}
                        />
                        <AvatarFallback>
                          {lesson.teacherName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">
                            {lesson.teacherName}
                          </h3>
                          <Badge variant="outline">{lesson.language}</Badge>
                          <Badge
                            variant={
                              lesson.type === "trial" ? "secondary" : "default"
                            }
                          >
                            {lesson.type}
                          </Badge>
                          {lesson.rating && (
                            <div className="flex items-center">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                              <span className="text-sm font-medium">
                                {lesson.rating}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {lesson.topic}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(lesson.date)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {lesson.time} ({lesson.duration} min)
                          </div>
                        </div>
                        {lesson.notes && (
                          <p className="text-sm mt-2 p-2 bg-muted rounded">
                            {lesson.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact Teacher
                      </Button>
                      <Button variant="outline" size="sm">
                        Book Again
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {cancelledLessons.map((lesson) => (
              <Card
                key={lesson.id}
                className="hover:shadow-md transition-shadow opacity-75"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={lesson.teacherAvatar}
                          alt={lesson.teacherName}
                        />
                        <AvatarFallback>
                          {lesson.teacherName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold line-through">
                            {lesson.teacherName}
                          </h3>
                          <Badge variant="outline">{lesson.language}</Badge>
                          <Badge variant="destructive">Cancelled</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {lesson.topic}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(lesson.date)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {lesson.time} ({lesson.duration} min)
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Book New Lesson
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {mockLessons.map((lesson) => (
              <Card
                key={lesson.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={lesson.teacherAvatar}
                          alt={lesson.teacherName}
                        />
                        <AvatarFallback>
                          {lesson.teacherName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">
                            {lesson.teacherName}
                          </h3>
                          <Badge variant="outline">{lesson.language}</Badge>
                          <Badge
                            variant={
                              lesson.status === "completed"
                                ? "default"
                                : lesson.status === "upcoming"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {lesson.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {lesson.topic}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(lesson.date)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {lesson.time} ({lesson.duration} min)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
