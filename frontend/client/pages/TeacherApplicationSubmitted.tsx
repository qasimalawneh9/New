import { Link } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  Mail,
  FileText,
  MessageCircle,
  Star,
} from "lucide-react";

export default function TeacherApplicationSubmitted() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold mb-4">
            Application Submitted Successfully!
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Thank you for applying to become a teacher on LinguaConnect. We're
            excited to review your application!
          </p>

          <Card className="mb-8 text-left">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">What happens next?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Application Review</h4>
                    <p className="text-sm text-muted-foreground">
                      Our team will review your application within 24-48 hours
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Document Verification</h4>
                    <p className="text-sm text-muted-foreground">
                      We'll verify your credentials and teaching qualifications
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <Mail className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Email Notification</h4>
                    <p className="text-sm text-muted-foreground">
                      You'll receive an email with our decision and next steps
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5">
                    <Star className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Start Teaching</h4>
                    <p className="text-sm text-muted-foreground">
                      Once approved, you can immediately start teaching and
                      earning
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">
              Application Reference
            </h3>
            <p className="text-blue-800 text-sm mb-3">
              Your application ID:{" "}
              <span className="font-mono">TCA-2024-001</span>
            </p>
            <p className="text-blue-700 text-sm">
              Save this reference number for future correspondence
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/login">
                <CheckCircle className="w-4 h-4 mr-2" />
                Sign In to Check Status
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/teacher-resources">View Teaching Resources</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/contact">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Link>
            </Button>
          </div>

          <div className="mt-8 text-sm text-muted-foreground">
            <p>
              Questions? Email us at{" "}
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
