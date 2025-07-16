import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  RefreshCw,
  MessageCircle,
  FileText,
} from "lucide-react";
import { db } from "../lib/database";

export default function TeacherApplicationStatus() {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">
              Teacher Application Status
            </h1>
            <p className="text-lg text-muted-foreground">
              Track the progress of your teaching application
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Application Overview</span>
                <Badge className={getStatusColor(applicationData.status)}>
                  {applicationData.status.charAt(0).toUpperCase() +
                    applicationData.status.slice(1)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Personal Information</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {applicationData.name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {applicationData.email}
                    </p>
                    <p>
                      <span className="font-medium">Country:</span>{" "}
                      {applicationData.country}
                    </p>
                    <p>
                      <span className="font-medium">Experience:</span>{" "}
                      {applicationData.experience} years
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Teaching Details</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Languages:</span>{" "}
                      {applicationData.languages.join(", ")}
                    </p>
                    <p>
                      <span className="font-medium">Native Language:</span>{" "}
                      {applicationData.nativeLanguage}
                    </p>
                    <p>
                      <span className="font-medium">Hourly Rate:</span> $
                      {applicationData.price}
                    </p>
                    <p>
                      <span className="font-medium">Applied:</span>{" "}
                      {new Date(applicationData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {applicationData.status === "pending" && (
            <Alert className="mb-6">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <strong>Your application is under review.</strong> Our team
                typically reviews applications within 24-48 hours. You'll
                receive an email notification once a decision has been made.
              </AlertDescription>
            </Alert>
          )}

          {applicationData.status === "approved" && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>
                  Congratulations! Your application has been approved.
                </strong>{" "}
                You can now access your teacher dashboard and start creating
                lessons.
              </AlertDescription>
            </Alert>
          )}

          {applicationData.status === "rejected" && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Application Not Approved.</strong> Unfortunately, we
                cannot approve your application at this time. Please contact our
                support team for more information or to reapply.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applicationData.status === "pending" && (
                  <>
                    <div className="flex items-start space-x-3">
                      {getStatusIcon("pending")}
                      <div>
                        <h4 className="font-medium">Application Review</h4>
                        <p className="text-sm text-muted-foreground">
                          Our team is currently reviewing your application and
                          credentials.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Email Notification</h4>
                        <p className="text-sm text-muted-foreground">
                          You'll receive an email with our decision and next
                          steps.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {applicationData.status === "approved" && (
                  <>
                    <div className="flex items-start space-x-3">
                      {getStatusIcon("approved")}
                      <div>
                        <h4 className="font-medium">
                          Access Teacher Dashboard
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Set up your profile, availability, and start teaching.
                        </p>
                        <Button className="mt-2" asChild>
                          <Link to="/teacher-dashboard">Go to Dashboard</Link>
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {applicationData.status === "rejected" && (
                  <>
                    <div className="flex items-start space-x-3">
                      <MessageCircle className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Contact Support</h4>
                        <p className="text-sm text-muted-foreground">
                          Get feedback on your application or information about
                          reapplying.
                        </p>
                        <Button variant="outline" className="mt-2" asChild>
                          <Link to="/contact">Contact Support</Link>
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link to="/teacher-resources">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Teaching Resources
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/help">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Help Center
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  logout();
                  window.location.href = "/";
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Questions about your application? Email us at{" "}
              <a
                href="mailto:teachers@linguaconnect.com"
                className="text-primary hover:underline"
              >
                teachers@linguaconnect.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
