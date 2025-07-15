import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  UserCheck,
  CreditCard,
  Shield,
  AlertTriangle,
  Copyright,
  DollarSign,
  Clock,
  Package,
} from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full mr-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <Badge variant="secondary" className="text-sm">
                Legal Document
              </Badge>
            </div>
            <h1 className="text-4xl font-bold mb-4">📜 Terms of Service</h1>
            <p className="text-xl text-muted-foreground mb-2">Talkcon</p>
            <p className="text-sm text-muted-foreground">
              Last Updated: July 11, 2025
            </p>
          </div>

          {/* Introduction */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <p className="text-lg leading-relaxed">
                By using Talkcon, you agree to the following terms:
              </p>
            </CardContent>
          </Card>

          {/* Eligibility */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="w-6 h-6 mr-3 text-primary" />
                1. Eligibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Users must be at least 16 years old</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Accurate and up-to-date information is required</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Smart Booking System */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-6 h-6 mr-3 text-primary" />
                2. Booking & Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2" />✅ Smart Booking System
                </h4>
                <p className="text-blue-800 mb-4">
                  When the student clicks "Book a Lesson", display a modal with
                  5 steps:
                </p>

                {/* Step 1 */}
                <div className="mb-4">
                  <h5 className="font-medium text-blue-900 mb-2 flex items-center">
                    🧭 Step 1 – Select Lesson Type:
                  </h5>
                  <div className="ml-4 space-y-1 text-blue-800">
                    <div>[ ] Single Lesson</div>
                    <div>[ ] Custom Package (5–25 lessons)</div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="mb-4">
                  <h5 className="font-medium text-blue-900 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    🕒 Step 2 – Select Lesson Duration:
                  </h5>
                  <div className="ml-4 space-y-1 text-blue-800">
                    <div>30 minutes</div>
                    <div>60 minutes</div>
                    <div>90 minutes</div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="mb-4">
                  <h5 className="font-medium text-blue-900 mb-2">
                    📚 Step 3 – If Package Selected:
                  </h5>
                  <div className="ml-4 text-blue-800">
                    Input field or slider (min: 5, max: 25, step: 1)
                  </div>
                </div>

                {/* Step 4 */}
                <div className="mb-4">
                  <h5 className="font-medium text-blue-900 mb-2 flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    💰 Step 4 – Real-Time Price Calculation:
                  </h5>
                  <div className="ml-4 space-y-1 text-blue-800">
                    <div>Teachers set their own prices by duration</div>
                    <div>Custom package pricing (if defined) is used</div>
                    <div>
                      If no package price, calculate: lesson price × quantity
                    </div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="mb-4">
                  <h5 className="font-medium text-blue-900 mb-2">
                    🧾 Step 5 – Price Summary:
                  </h5>
                  <div className="ml-4 bg-white rounded-lg p-4 border border-blue-200">
                    <div className="space-y-2 text-sm text-blue-900">
                      <div>Duration: [X]</div>
                      <div>Number of Lessons: [X]</div>
                      <div>Price Before Tax: $[XX.XX]</div>
                      <div>Tax (10%): $[XX.XX]</div>
                      <div className="font-semibold border-t pt-2">
                        Final Price: $[XX.XX]
                      </div>
                      <div className="text-xs text-blue-700 italic">
                        &gt; Teacher receives: [Total – 20% commission]
                      </div>
                      <div className="text-xs text-blue-700">
                        Student pays full total including tax
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-200">
                  <p className="text-green-800 font-medium">
                    🟢 Display button: "Confirm & Pay"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Behavior */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-6 h-6 mr-3 text-primary" />
                3. Platform Behavior
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>The platform is for educational use only</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>
                    Offensive, discriminatory, or inappropriate content is
                    prohibited
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Responsibility */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-6 h-6 mr-3 text-primary" />
                4. Responsibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>
                    Talkcon is not liable for interactions outside the platform
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Violating accounts may be suspended or removed</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Copyright className="w-6 h-6 mr-3 text-primary" />
                5. Intellectual Property
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>
                    All content belongs to Talkcon or the tutor (if original)
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>
                    Reuse without written permission is strictly prohibited
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">
                Questions about our terms?
              </h3>
              <p className="text-muted-foreground mb-6">
                Contact our legal team for any questions about these terms.
              </p>
              <a
                href="mailto:legal@talkcon.org"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Contact Legal Team
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
