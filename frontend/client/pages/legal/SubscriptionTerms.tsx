import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  CreditCard,
  RefreshCw,
  DollarSign,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function SubscriptionTerms() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full mr-4">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <Badge variant="secondary" className="text-sm">
                Legal Document
              </Badge>
            </div>
            <h1 className="text-4xl font-bold mb-4">📦 Subscription Terms</h1>
            <p className="text-xl text-muted-foreground mb-2">Talkcon</p>
            <p className="text-sm text-muted-foreground">
              Last Updated: July 11, 2025
            </p>
          </div>

          {/* Plans */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-6 h-6 mr-3 text-primary" />
                1. Plans
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Monthly, yearly, or custom subscriptions</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>
                    May include lesson credits, exclusive features, or priority
                    support
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Payments */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-6 h-6 mr-3 text-primary" />
                2. Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <span>Talkcon is not responsible for failed payments</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Auto-Renewal & Cancellation */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="w-6 h-6 mr-3 text-primary" />
                3. Auto-Renewal & Cancellation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-yellow-800 mb-1">
                      Important Notice
                    </p>
                    <p className="text-yellow-700 text-sm">
                      Plans auto-renew unless canceled 24 hours before renewal
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
            </CardContent>
          </Card>

          {/* Refunds */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-6 h-6 mr-3 text-primary" />
                4. Refunds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>
                    Only granted in cases of technical failure caused by Talkcon
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>
                    Contact:{" "}
                    <a
                      href="mailto:support@talkcon.org"
                      className="text-primary hover:underline"
                    >
                      support@talkcon.org
                    </a>
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Credit Expiry */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-6 h-6 mr-3 text-primary" />
                5. Credit Expiry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-800 mb-1">
                      Credit Expiration
                    </p>
                    <p className="text-red-700">
                      All credits expire <strong>90 days</strong> after issuance
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Plans Overview */}
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">
                📋 Subscription Plans Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Monthly</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Lesson credits included</li>
                    <li>• Standard support</li>
                    <li>• Monthly billing</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Yearly</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• More lesson credits</li>
                    <li>• Priority support</li>
                    <li>• 2 months free</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Custom</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Tailored packages</li>
                    <li>• Exclusive features</li>
                    <li>• Dedicated support</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">
                Questions about subscriptions?
              </h3>
              <p className="text-muted-foreground mb-6">
                Contact our billing team for help with your subscription.
              </p>
              <a
                href="mailto:billing@talkcon.org"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Contact Billing Team
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
