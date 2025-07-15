import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Footer } from "@/components/ui/footer";
import {
  Clock,
  Mail,
  RefreshCw,
  MessageCircle,
  FileText,
  CheckCircle,
  Users,
  GraduationCap,
  LogOut,
  BookOpen,
} from "lucide-react";
import { db } from "../lib/database";

export default function TeacherApplicationUnderReview() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [applicationData, setApplicationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.email) {
      const teacherData = db.getTeacherByEmail(user.email);
      setApplicationData(teacherData);
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            Loading application status...
          </div>
        </div>
      </div>
    );
  }

  if (!applicationData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Application Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find your teacher application. Please contact support.
            </p>
            <Button asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-800 to-red-900 bg-clip-text text-transparent">
              Application Under Review
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Thank you for applying to become a teacher on Talkcon! Your
              application is currently being reviewed by our team.
            </p>
          </div>

          {/* Status Alert */}
          <Alert className="mb-8 border-yellow-200 bg-yellow-50">
            <Clock className="h-5 w-5 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <div className="font-semibold mb-2">
                Your application is under review
              </div>
              <p>
                Our review team is carefully evaluating your teaching
                credentials, experience, and application materials. We'll notify
                you of our decision via email within 24-48 hours.
              </p>
            </AlertDescription>
          </Alert>

          {/* Application Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Application Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                      Personal Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium">
                          {applicationData.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium">
                          {applicationData.email}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Country:</span>
                        <span className="font-medium">
                          {applicationData.country}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                      Teaching Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Experience:
                        </span>
                        <span className="font-medium">
                          {applicationData.experience} years
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Languages:
                        </span>
                        <span className="font-medium">
                          {applicationData.languages?.join(", ")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Hourly Rate:
                        </span>
                        <span className="font-medium">
                          ${applicationData.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Next Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Review Process</h3>
                    <p className="text-sm text-muted-foreground">
                      Our experienced team reviews each application carefully,
                      checking credentials, teaching experience, and ensuring
                      quality standards.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Email Notification</h3>
                    <p className="text-sm text-muted-foreground">
                      Once the review is complete, you'll receive an email with
                      our decision and detailed next steps for your teaching
                      journey.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Review Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">Application Submitted</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(applicationData.createdAt).toLocaleDateString()}{" "}
                      - Your application has been received
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">Under Review</h4>
                    <p className="text-sm text-muted-foreground">
                      Currently in progress - Our team is evaluating your
                      application
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Decision & Next Steps</h4>
                    <p className="text-sm text-muted-foreground">
                      You'll receive an email with our decision within 24-48
                      hours
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="outline" asChild>
              <Link to="/teacher-resources">
                <GraduationCap className="w-4 h-4 mr-2" />
                Teaching Resources
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/help">
                <MessageCircle className="w-4 h-4 mr-2" />
                Help Center
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/contact">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Link>
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>
              Questions about your application?{" "}
              <a
                href="mailto:teachers@talkcon.com"
                className="text-primary hover:underline"
              >
                teachers@talkcon.com
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
