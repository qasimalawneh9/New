import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, Lock, UserCheck, Database, FileText } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full mr-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <Badge variant="secondary" className="text-sm">
                Legal Document
              </Badge>
            </div>
            <h1 className="text-4xl font-bold mb-4">🔐 Privacy Policy</h1>
            <p className="text-xl text-muted-foreground mb-2">Talkcon</p>
            <p className="text-sm text-muted-foreground">
              Last Updated: July 11, 2025
            </p>
          </div>

          {/* Introduction */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <p className="text-lg leading-relaxed">
                Talkcon is committed to protecting your privacy. This policy
                explains how we collect, use, and safeguard your personal
                information when you use the platform.
              </p>
            </CardContent>
          </Card>

          {/* Data Collection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-6 h-6 mr-3 text-primary" />
                1. What We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>
                    Full name, email, country, phone number (optional)
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Registration data and preferred language</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Booked lessons, session history, message logs</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Payment and transaction data</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Session recordings (with consent)</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Usage */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-6 h-6 mr-3 text-primary" />
                2. How We Use Your Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>To improve our services and learning experience</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>To manage bookings, payments, and communication</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>For technical support, analytics, and reporting</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="w-6 h-6 mr-3 text-primary" />
                3. Data Sharing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="font-semibold text-green-800">
                  We never sell your data
                </p>
              </div>
              <p className="font-medium mb-3">We share it only with:</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Payment providers (Stripe, PayPal)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Analytics tools</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Legal authorities if required by law</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* User Rights */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-6 h-6 mr-3 text-primary" />
                4. Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Access, correct, or delete your personal data</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Withdraw consent at any time</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>
                    Contact us at:{" "}
                    <a
                      href="mailto:privacy@talkcon.org"
                      className="text-primary hover:underline"
                    >
                      privacy@talkcon.org
                    </a>
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Cookie Policy */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-6 h-6 mr-3 text-primary" />
                🍪 Cookie Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">
                We use cookies to enhance your browsing experience—such as
                remembering language preferences, login status, and for
                analytics. You can manage cookie settings through your browser.
                Disabling cookies may impact some features.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">
                Questions about your privacy?
              </h3>
              <p className="text-muted-foreground mb-6">
                Contact our privacy team for any questions or concerns about
                your data.
              </p>
              <a
                href="mailto:privacy@talkcon.org"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Contact Privacy Team
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
