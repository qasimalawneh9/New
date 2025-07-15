import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UserCheck,
  FileText,
  DollarSign,
  Shield,
  BookOpen,
  Copyright,
  Award,
} from "lucide-react";

export default function TutorAgreement() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full mr-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <Badge variant="secondary" className="text-sm">
                Legal Document
              </Badge>
            </div>
            <h1 className="text-4xl font-bold mb-4">👨‍🏫 Tutor Agreement</h1>
            <p className="text-xl text-muted-foreground mb-2">Talkcon</p>
            <p className="text-sm text-muted-foreground">
              Last Updated: July 11, 2025
            </p>
          </div>

          {/* Independent Status */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="w-6 h-6 mr-3 text-primary" />
                1. Independent Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Tutors are independent contractors, not employees</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>
                    Responsible for managing their own schedule and taxes
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Content Ownership */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Copyright className="w-6 h-6 mr-3 text-primary" />
                2. Content Ownership
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>
                    Tutors retain full ownership of their original content
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>
                    By uploading, they grant Talkcon a non-exclusive license to
                    display and promote their content
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Commission & Payouts */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-6 h-6 mr-3 text-primary" />
                3. Commission & Payouts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-4">
                  Commission Structure
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-blue-800">
                      Talkcon charges a <strong>20% commission</strong> on each
                      booking
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-blue-800">
                      Payouts are available after lesson completion or 48-hour
                      auto-confirmation
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-blue-800">
                      Payout methods: PayPal (min $10), Bank Transfer (min $100)
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Conduct */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-6 h-6 mr-3 text-primary" />
                4. Conduct
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Tutors must remain professional and respectful</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>
                    Repeated absence or misconduct leads to penalties or account
                    suspension
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Lesson Policies */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-primary" />
                5. Lesson Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Tutors must mark attendance and report no-shows</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Unexcused absences affect tutor ranking</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Payout Schedule */}
          <Card className="mb-8 bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">
                💰 Quick Payout Reference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">PayPal</h4>
                  <p className="text-green-700 text-sm">
                    Minimum: $10
                    <br />
                    Processing: 1-2 business days
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">
                    Bank Transfer
                  </h4>
                  <p className="text-green-700 text-sm">
                    Minimum: $100
                    <br />
                    Processing: 3-5 business days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">
                Questions about tutoring?
              </h3>
              <p className="text-muted-foreground mb-6">
                Contact our tutor support team for help with your teaching
                experience.
              </p>
              <a
                href="mailto:tutors@talkcon.org"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Contact Tutor Support
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
