import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Calendar,
  Clock,
  Globe,
  MessageCircle,
  Download,
  Share,
  Star,
  MapPin,
  Video,
  Users,
} from "lucide-react";

interface BookingDetails {
  id: string;
  teacherName: string;
  teacherAvatar: string;
  teacherRating: number;
  teacherCountry: string;
  language: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  lessonType: string;
  status: "confirmed" | "pending" | "cancelled";
  meetingLink: string;
  notes?: string;
}

export default function BookingConfirmation() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have data from the booking flow
    if (location.state?.bookingData && location.state?.teacher) {
      const { bookingData, teacher } = location.state;
      // Extract date and time from the lesson date
      const lessonDate = new Date(bookingData.date);
      const dateString = lessonDate.toISOString().split("T")[0];
      const timeString = lessonDate
        .toTimeString()
        .split(" ")[0]
        .substring(0, 5);

      const bookingDetails: BookingDetails = {
        id: id || `booking_${Date.now()}`,
        teacherName: teacher.name,
        teacherAvatar: teacher.avatar,
        teacherRating: teacher.rating,
        teacherCountry: teacher.country,
        language: teacher.nativeLanguage || teacher.languages[0] || "English",
        date: dateString,
        time: timeString,
        duration: bookingData.duration,
        price: bookingData.price,
        lessonType:
          bookingData.type === "trial" ? "Trial Lesson" : "Regular Lesson",
        status: "confirmed",
        meetingLink: `https://meet.linguaconnect.com/room/${id}`,
        notes: bookingData.notes,
      };
      setBooking(bookingDetails);
      setLoading(false);
      return;
    }

    // Fallback to mock data if no state passed
    const mockBooking: BookingDetails = {
      id: "booking_123",
      teacherName: "Maria Rodriguez",
      teacherAvatar: "/placeholder.svg",
      teacherRating: 4.9,
      teacherCountry: "Spain",
      language: "Spanish",
      date: "2024-01-20",
      time: "15:00",
      duration: 50,
      price: 25,
      lessonType: "Business Spanish",
      status: "confirmed",
      meetingLink: "https://meet.linguaconnect.com/room/abc123",
      notes: "Focus on presentation skills and business vocabulary",
    };

    setTimeout(() => {
      setBooking(mockBooking);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-16 bg-muted rounded-lg" />
              <div className="h-64 bg-muted rounded-lg" />
              <div className="h-48 bg-muted rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">Booking not found</h3>
              <p className="text-muted-foreground mb-4">
                The booking you're looking for doesn't exist.
              </p>
              <Button asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) {
      // If no time string, try to extract from booking date
      if (booking?.date) {
        const date = new Date(booking.date);
        return date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      }
      return "Time TBD";
    }

    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Spanish Lesson with ${booking.teacherName}`,
        text: `I have a Spanish lesson scheduled for ${formatDate(booking.date)} at ${formatTime(booking.time)}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-700 mb-2">
              Lesson Confirmed!
            </h1>
            <p className="text-muted-foreground">
              Your lesson has been successfully booked. You'll receive a
              confirmation email shortly.
            </p>
          </div>

          {/* Booking Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Lesson Details</span>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  Confirmed
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Teacher Info */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={booking.teacherAvatar}
                    alt={booking.teacherName}
                  />
                  <AvatarFallback>
                    {booking.teacherName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {booking.teacherName}
                  </h3>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{booking.teacherCountry}</span>
                    <span>•</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{booking.teacherRating}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="mt-2">
                    {booking.language} Teacher
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Lesson Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(booking.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(booking.time)} ({booking.duration} minutes)
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Lesson Type</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.lessonType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Price</p>
                      <p className="text-sm text-muted-foreground">
                        ${booking.price}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="font-medium mb-2">Lesson Focus</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.notes}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button size="lg" className="h-12" asChild>
              <Link to={`/lesson/${booking.id}`}>
                <Video className="w-4 h-4 mr-2" />
                Join Lesson Room
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12" asChild>
              <Link to="/messages">
                <MessageCircle className="w-4 h-4 mr-2" />
                Message Teacher
              </Link>
            </Button>
          </div>

          {/* Additional Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button variant="outline" className="justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Add to Calendar
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share className="w-4 h-4 mr-2" />
                  Share Lesson
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/dashboard">
                    <Users className="w-4 h-4 mr-2" />
                    View Dashboard
                  </Link>
                </Button>
              </div>

              <Separator />

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Preparation Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Test your camera and microphone 5 minutes before</li>
                  <li>• Find a quiet, well-lit space for the lesson</li>
                  <li>• Have a notebook ready for taking notes</li>
                  <li>• Join the lesson room a few minutes early</li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">
                  Need to reschedule?
                </h4>
                <p className="text-sm text-blue-700">
                  You can reschedule your lesson up to 4 hours before the
                  scheduled time at no additional cost.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Reschedule Lesson
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
