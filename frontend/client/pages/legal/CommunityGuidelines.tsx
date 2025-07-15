import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Heart,
  Shield,
  AlertTriangle,
  Flag,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function CommunityGuidelines() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full mr-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <Badge variant="secondary" className="text-sm">
                Community Rules
              </Badge>
            </div>
            <h1 className="text-4xl font-bold mb-4">👥 Community Guidelines</h1>
            <p className="text-xl text-muted-foreground mb-2">Talkcon</p>
            <p className="text-sm text-muted-foreground">
              Last Updated: July 11, 2025
            </p>
          </div>

          {/* Introduction */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <p className="text-lg leading-relaxed">
                Welcome to the Talkcon community! These guidelines help ensure a
                positive, respectful, and productive learning environment for
                all our users.
              </p>
            </CardContent>
          </Card>

          {/* Expected Behavior */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-6 h-6 mr-3 text-green-600" />
                1. Expected Behavior
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                      <strong>Professional and courteous</strong> communication
                      required
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-green-700">
                      <strong>Constructive feedback</strong> and encouragement
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-green-700">
                      <strong>Cultural sensitivity</strong> and understanding
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Prohibited Behavior */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-6 h-6 mr-3 text-red-600" />
                2. Prohibited Behavior
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h4 className="font-semibold text-red-800 mb-4">
                  ❌ Strictly Prohibited
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-red-700">
                      <strong>Hate speech, discrimination,</strong> or offensive
                      content
                    </span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-red-700">
                      <strong>Sharing contact info</strong> outside the platform
                    </span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-red-700">
                      <strong>Using the platform</strong> for non-educational
                      purposes
                    </span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-red-700">
                      <strong>Harassment or bullying</strong> of any kind
                    </span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-red-700">
                      <strong>Spam or promotional content</strong> unrelated to
                      learning
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Reporting */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Flag className="w-6 h-6 mr-3 text-primary" />
                3. Reporting Violations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                        Click the report button available on all content and
                        profiles
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">
                        2
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">
                        Provide details
                      </p>
                      <p className="text-blue-700 text-sm">
                        Include specific information about the violation
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
            </CardContent>
          </Card>

          {/* Consequences */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-6 h-6 mr-3 text-orange-600" />
                Consequences for Violations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <p className="text-red-700 text-sm">Permanent account ban</p>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                <p className="text-gray-700 text-sm">
                  <strong>Note:</strong> Severe violations (hate speech,
                  harassment) may result in immediate permanent ban.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Safe Learning Environment */}
          <Card className="mb-8 bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">
                🛡️ Creating a Safe Learning Environment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-800 mb-3">
                    For Students
                  </h4>
                  <ul className="space-y-2 text-green-700 text-sm">
                    <li>• Be respectful to your tutor's time and expertise</li>
                    <li>• Come prepared for lessons</li>
                    <li>• Provide constructive feedback</li>
                    <li>• Report any inappropriate behavior</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-800 mb-3">
                    For Tutors
                  </h4>
                  <ul className="space-y-2 text-green-700 text-sm">
                    <li>• Maintain professional boundaries</li>
                    <li>• Provide patient and supportive guidance</li>
                    <li>• Respect cultural differences</li>
                    <li>• Keep lessons focused on education</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">
                Questions about community guidelines?
              </h3>
              <p className="text-muted-foreground mb-6">
                Contact our community team for clarification or to report
                violations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:community@talkcon.org"
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Contact Community Team
                </a>
                <button
                  className="inline-flex items-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
                  onClick={() => {
                    // This would open a report modal in a real implementation
                    alert("Report feature would open here");
                  }}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Report Violation
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
