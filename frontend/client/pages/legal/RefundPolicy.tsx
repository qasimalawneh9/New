import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  UserX,
  UserCheck,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full mr-4">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <Badge variant="secondary" className="text-sm">
                Legal Document
              </Badge>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              💰 Cancellation & Refund Policy
            </h1>
            <p className="text-xl text-muted-foreground mb-2">Talkcon</p>
            <p className="text-sm text-muted-foreground">
              Last Updated: July 11, 2025
            </p>
          </div>

          {/* Student Absence */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserX className="w-6 h-6 mr-3 text-red-600" />
                1. If Student Is Absent
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-orange-800 mb-1">
                      Reschedule Policy
                    </p>
                    <p className="text-orange-700 text-sm">
                      Tutor may reschedule once within 7 days
                    </p>
                  </div>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>
                    If the student does not respond in 24 hours, the session is
                    marked completed
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Tutor Absence */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="w-6 h-6 mr-3 text-blue-600" />
                2. If Tutor Is Absent
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <UserCheck className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-800 mb-1">
                      Student Options
                    </p>
                    <p className="text-blue-700 text-sm">
                      Student may request a reschedule or full refund
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-800 mb-1">
                      Penalty for Tutors
                    </p>
                    <p className="text-red-700 text-sm">
                      After <strong>3 absences</strong>, the tutor account may
                      be suspended
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cancellation Policy */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <XCircle className="w-6 h-6 mr-3 text-primary" />
                3. Cancellation Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-green-800 mb-2">
                      Free Cancellation
                    </h4>
                    <p className="text-green-700 text-sm">
                      Up to <strong>12 hours</strong> before lesson
                    </p>
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h4 className="font-semibold text-red-800 mb-2">
                      No Refund
                    </h4>
                    <p className="text-red-700 text-sm">
                      For cancellations <strong>under 12 hours</strong>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Refund Process */}
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">
                🔄 Refund Process Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-white rounded-lg border border-blue-200">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">
                      1
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800">
                      Request Submitted
                    </h4>
                    <p className="text-blue-700 text-sm">
                      Student or tutor submits refund request
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-white rounded-lg border border-blue-200">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">
                      2
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800">
                      Review Process
                    </h4>
                    <p className="text-blue-700 text-sm">
                      Team reviews within 24-48 hours
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-white rounded-lg border border-blue-200">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">
                      3
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800">
                      Refund Processed
                    </h4>
                    <p className="text-blue-700 text-sm">
                      Approved refunds processed within 3-5 business days
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Circumstances */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-6 h-6 mr-3 text-primary" />
                Special Circumstances
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    Technical Issues
                  </h4>
                  <p className="text-yellow-700 text-sm">
                    Full refund for platform-related technical problems
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">
                    Emergency Situations
                  </h4>
                  <p className="text-purple-700 text-sm">
                    Case-by-case review for medical or family emergencies
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">
                Need help with a refund?
              </h3>
              <p className="text-muted-foreground mb-6">
                Contact our support team for assistance with cancellations and
                refunds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:refunds@talkcon.org"
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Contact Refund Team
                </a>
                <a
                  href="/help"
                  className="inline-flex items-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
                >
                  Visit Help Center
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
