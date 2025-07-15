import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  FileText,
  Award,
  Package,
  DollarSign,
  Users,
  Eye,
  Lock,
  UserCheck,
  Database,
  Heart,
  AlertTriangle,
  Flag,
  Clock,
  CheckCircle,
  Copyright,
  CreditCard,
  RefreshCw,
  UserX,
  XCircle,
} from "lucide-react";

export default function Legal() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full mr-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <Badge variant="secondary" className="text-sm">
                Legal Documentation
              </Badge>
            </div>
            <h1 className="text-4xl font-bold mb-4">📋 Legal Center</h1>
            <p className="text-xl text-muted-foreground mb-2">
              Talkcon Legal Documents
            </p>
            <p className="text-sm text-muted-foreground">
              Last Updated: July 11, 2025
            </p>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              This page contains all our legal documents in one place for your
              convenience. Please read through all sections to understand your
              rights and responsibilities when using Talkcon.
            </p>
          </div>

          {/* Legal Documents Tabs */}
          <Tabs defaultValue="privacy" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="terms">Terms</TabsTrigger>
              <TabsTrigger value="tutor">Tutor</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="refund">Refund</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
            </TabsList>

            {/* Privacy Policy */}
            <TabsContent value="privacy" className="space-y-8">
              <Card className="border-2 border-primary/20">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center text-2xl">
                    <Shield className="w-8 h-8 mr-3 text-primary" />
                    🔐 Privacy Policy
                  </CardTitle>
                  <p className="text-muted-foreground">
                    How we collect, use, and protect your personal information
                  </p>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <p className="text-lg leading-relaxed">
                    Talkcon is committed to protecting your privacy. This policy
                    explains how we collect, use, and safeguard your personal
                    information when you use the platform.
                  </p>

                  {/* Data Collection */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Database className="w-6 h-6 mr-3 text-primary" />
                      1. What We Collect
                    </h3>
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
                        <span>
                          Booked lessons, session history, message logs
                        </span>
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
                  </div>

                  {/* Data Usage */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Eye className="w-6 h-6 mr-3 text-primary" />
                      2. How We Use Your Data
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>
                          To improve our services and learning experience
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>
                          To manage bookings, payments, and communication
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>
                          For technical support, analytics, and reporting
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Data Sharing */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <UserCheck className="w-6 h-6 mr-3 text-primary" />
                      3. Data Sharing
                    </h3>
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
                  </div>

                  {/* User Rights */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Lock className="w-6 h-6 mr-3 text-primary" />
                      4. Your Rights
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>
                          Access, correct, or delete your personal data
                        </span>
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
                  </div>

                  {/* Cookie Policy */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-blue-800">
                      <FileText className="w-6 h-6 mr-3" />
                      🍪 Cookie Policy
                    </h3>
                    <p className="leading-relaxed text-blue-700">
                      We use cookies to enhance your browsing experience—such as
                      remembering language preferences, login status, and for
                      analytics. You can manage cookie settings through your
                      browser. Disabling cookies may impact some features.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Terms of Service */}
            <TabsContent value="terms" className="space-y-8">
              <Card className="border-2 border-primary/20">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center text-2xl">
                    <FileText className="w-8 h-8 mr-3 text-primary" />
                    📜 Terms of Service
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Rules and conditions for using our platform
                  </p>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <p className="text-lg leading-relaxed">
                    By using Talkcon, you agree to the following terms:
                  </p>

                  {/* Eligibility */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <UserCheck className="w-6 h-6 mr-3 text-primary" />
                      1. Eligibility
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Users must be at least 16 years old</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>
                          Accurate and up-to-date information is required
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Smart Booking System */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <CreditCard className="w-6 h-6 mr-3 text-primary" />
                      2. Booking & Payments
                    </h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                        <Package className="w-5 h-5 mr-2" />✅ Smart Booking
                        System
                      </h4>
                      <p className="text-blue-800 mb-4">
                        When the student clicks "Book a Lesson", display a modal
                        with 5 steps:
                      </p>

                      <div className="space-y-4">
                        {/* Steps 1-5 */}
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <h5 className="font-medium text-blue-900 mb-2">
                            🧭 Step 1 – Select Lesson Type:
                          </h5>
                          <div className="ml-4 space-y-1 text-blue-800">
                            <div>[ ] Single Lesson</div>
                            <div>[ ] Custom Package (5–25 lessons)</div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <h5 className="font-medium text-blue-900 mb-2">
                            🕒 Step 2 – Select Lesson Duration:
                          </h5>
                          <div className="ml-4 space-y-1 text-blue-800">
                            <div>30 minutes</div>
                            <div>60 minutes</div>
                            <div>90 minutes</div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <h5 className="font-medium text-blue-900 mb-2">
                            📚 Step 3 – If Package Selected:
                          </h5>
                          <div className="ml-4 text-blue-800">
                            Input field or slider (min: 5, max: 25, step: 1)
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <h5 className="font-medium text-blue-900 mb-2">
                            💰 Step 4 – Real-Time Price Calculation:
                          </h5>
                          <div className="ml-4 space-y-1 text-blue-800">
                            <div>Teachers set their own prices by duration</div>
                            <div>
                              Custom package pricing (if defined) is used
                            </div>
                            <div>
                              If no package price, calculate: lesson price ×
                              quantity
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <h5 className="font-medium text-blue-900 mb-2">
                            🧾 Step 5 – Price Summary:
                          </h5>
                          <div className="bg-gray-50 rounded-lg p-4 border">
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

                        <div className="p-3 bg-green-100 rounded-lg border border-green-200">
                          <p className="text-green-800 font-medium">
                            🟢 Display button: "Confirm & Pay"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Platform Behavior */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Shield className="w-6 h-6 mr-3 text-primary" />
                      3. Platform Behavior
                    </h3>
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
                  </div>

                  {/* Responsibility */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <AlertTriangle className="w-6 h-6 mr-3 text-primary" />
                      4. Responsibility
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>
                          Talkcon is not liable for interactions outside the
                          platform
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>
                          Violating accounts may be suspended or removed
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Intellectual Property */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Copyright className="w-6 h-6 mr-3 text-primary" />
                      5. Intellectual Property
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>
                          All content belongs to Talkcon or the tutor (if
                          original)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>
                          Reuse without written permission is strictly
                          prohibited
                        </span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tutor Agreement */}
            <TabsContent value="tutor" className="space-y-8">
              <Card className="border-2 border-primary/20">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center text-2xl">
                    <Award className="w-8 h-8 mr-3 text-primary" />
                    👨‍🏫 Tutor Agreement
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Terms and conditions for tutors on our platform
                  </p>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  {/* Independent Status */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <UserCheck className="w-6 h-6 mr-3 text-primary" />
                      1. Independent Status
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>
                          Tutors are independent contractors, not employees
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>
                          Responsible for managing their own schedule and taxes
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Content Ownership */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Copyright className="w-6 h-6 mr-3 text-primary" />
                      2. Content Ownership
                    </h3>
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
                          By uploading, they grant Talkcon a non-exclusive
                          license to display and promote their content
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Commission & Payouts */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <DollarSign className="w-6 h-6 mr-3 text-primary" />
                      3. Commission & Payouts
                    </h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-900 mb-4">
                        Commission Structure
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-blue-800">
                            Talkcon charges a <strong>20% commission</strong> on
                            each booking
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-blue-800">
                            Payouts are available after lesson completion or
                            48-hour auto-confirmation
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-blue-800">
                            Payout methods: PayPal (min $10), Bank Transfer (min
                            $100)
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Conduct */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Shield className="w-6 h-6 mr-3 text-primary" />
                      4. Conduct
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>
                          Tutors must remain professional and respectful
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>
                          Repeated absence or misconduct leads to penalties or
                          account suspension
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Lesson Policies */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FileText className="w-6 h-6 mr-3 text-primary" />
                      5. Lesson Policies
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>
                          Tutors must mark attendance and report no-shows
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Unexcused absences affect tutor ranking</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Subscription Terms */}
            <TabsContent value="subscription" className="space-y-8">
              <Card className="border-2 border-primary/20">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center text-2xl">
                    <Package className="w-8 h-8 mr-3 text-primary" />
                    📦 Subscription Terms
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Terms for subscription plans and billing
                  </p>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  {/* Plans */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Package className="w-6 h-6 mr-3 text-primary" />
                      1. Plans
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Monthly, yearly, or custom subscriptions</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>
                          May include lesson credits, exclusive features, or
                          priority support
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Payments */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <CreditCard className="w-6 h-6 mr-3 text-primary" />
                      2. Payments
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Charged in advance on a recurring basis</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>
                          Accepted methods: Credit card, PayPal, local gateways
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>
                          Talkcon is not responsible for failed payments
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Auto-Renewal & Cancellation */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <RefreshCw className="w-6 h-6 mr-3 text-primary" />
                      3. Auto-Renewal & Cancellation
                    </h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-yellow-800 mb-1">
                            Important Notice
                          </p>
                          <p className="text-yellow-700 text-sm">
                            Plans auto-renew unless canceled 24 hours before
                            renewal
                          </p>
                        </div>
                      </div>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Cancel from your account dashboard</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>
                          No refund is provided for the current billing cycle
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Credit Expiry */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Clock className="w-6 h-6 mr-3 text-primary" />
                      4. Credit Expiry
                    </h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Clock className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-red-800 mb-1">
                            Credit Expiration
                          </p>
                          <p className="text-red-700">
                            All credits expire <strong>90 days</strong> after
                            issuance
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Refund Policy */}
            <TabsContent value="refund" className="space-y-8">
              <Card className="border-2 border-primary/20">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center text-2xl">
                    <DollarSign className="w-8 h-8 mr-3 text-primary" />
                    💰 Cancellation & Refund Policy
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Policies for lesson cancellations and refunds
                  </p>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  {/* Student Absence */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <UserX className="w-6 h-6 mr-3 text-red-600" />
                      1. If Student Is Absent
                    </h3>
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
                          If the student does not respond in 24 hours, the
                          session is marked completed
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Tutor Absence */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <UserCheck className="w-6 h-6 mr-3 text-blue-600" />
                      2. If Tutor Is Absent
                    </h3>
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
                            After <strong>3 absences</strong>, the tutor account
                            may be suspended
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cancellation Policy */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <XCircle className="w-6 h-6 mr-3 text-primary" />
                      3. Cancellation Policy
                    </h3>
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
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Community Guidelines */}
            <TabsContent value="community" className="space-y-8">
              <Card className="border-2 border-primary/20">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center text-2xl">
                    <Users className="w-8 h-8 mr-3 text-primary" />
                    👥 Community Guidelines
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Rules for maintaining a respectful learning community
                  </p>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <p className="text-lg leading-relaxed">
                    Welcome to the Talkcon community! These guidelines help
                    ensure a positive, respectful, and productive learning
                    environment for all our users.
                  </p>

                  {/* Expected Behavior */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Heart className="w-6 h-6 mr-3 text-green-600" />
                      1. Expected Behavior
                    </h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h4 className="font-semibold text-green-800 mb-4">
                        ✅ What We Encourage
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-green-700">
                            <strong>Mutual respect</strong> between all users
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-green-700">
                            <strong>Professional and courteous</strong>{" "}
                            communication required
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-green-700">
                            <strong>Constructive feedback</strong> and
                            encouragement
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-green-700">
                            <strong>Cultural sensitivity</strong> and
                            understanding
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Prohibited Behavior */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Shield className="w-6 h-6 mr-3 text-red-600" />
                      2. Prohibited Behavior
                    </h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h4 className="font-semibold text-red-800 mb-4">
                        ❌ Strictly Prohibited
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-red-700">
                            <strong>Hate speech, discrimination,</strong> or
                            offensive content
                          </span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-red-700">
                            <strong>Sharing contact info</strong> outside the
                            platform
                          </span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-red-700">
                            <strong>Using the platform</strong> for
                            non-educational purposes
                          </span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-red-700">
                            <strong>Harassment or bullying</strong> of any kind
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Reporting */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Flag className="w-6 h-6 mr-3 text-primary" />
                      3. Reporting Violations
                    </h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-800 mb-4">
                        🚨 How to Report
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                            <span className="text-blue-600 font-semibold text-sm">
                              1
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-blue-800">
                              Use the "Report" button
                            </p>
                            <p className="text-blue-700 text-sm">
                              Click the report button available on all content
                              and profiles
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                            <Clock className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-blue-800">
                              Reports are reviewed within 24 hours
                            </p>
                            <p className="text-blue-700 text-sm">
                              Our moderation team reviews all reports promptly
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Consequences */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <AlertTriangle className="w-6 h-6 mr-3 text-orange-600" />
                      4. Consequences for Violations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-800 mb-2">
                          1st Violation
                        </h4>
                        <p className="text-yellow-700 text-sm">
                          Warning and content removal
                        </p>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <h4 className="font-semibold text-orange-800 mb-2">
                          2nd Violation
                        </h4>
                        <p className="text-orange-700 text-sm">
                          Temporary suspension (7-30 days)
                        </p>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="font-semibold text-red-800 mb-2">
                          3rd Violation
                        </h4>
                        <p className="text-red-700 text-sm">
                          Permanent account ban
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Contact Information */}
          <Card className="bg-primary/5 border-primary/20 mt-12">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-semibold mb-6">
                📧 Legal Support Contacts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h4 className="font-semibold mb-2">General Legal</h4>
                  <a
                    href="mailto:legal@talkcon.org"
                    className="text-primary hover:underline"
                  >
                    legal@talkcon.org
                  </a>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Privacy Concerns</h4>
                  <a
                    href="mailto:privacy@talkcon.org"
                    className="text-primary hover:underline"
                  >
                    privacy@talkcon.org
                  </a>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Billing & Refunds</h4>
                  <a
                    href="mailto:billing@talkcon.org"
                    className="text-primary hover:underline"
                  >
                    billing@talkcon.org
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
