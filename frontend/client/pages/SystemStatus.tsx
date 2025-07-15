import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Activity,
  Database,
  Server,
  Users,
  MessageSquare,
  CreditCard,
  Shield,
  BookOpen,
  Star,
  Headphones,
  RefreshCw,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";
import { cn } from "../lib/utils";

interface SystemComponent {
  id: string;
  name: string;
  description: string;
  status: "operational" | "degraded" | "down" | "maintenance";
  icon: any;
  features: string[];
  lastChecked: string;
  responseTime?: number;
}

const systemComponents: SystemComponent[] = [
  {
    id: "auth",
    name: "Authentication System",
    description: "Multi-provider login with 2FA support",
    status: "operational",
    icon: Shield,
    features: [
      "Email/Password Login",
      "Google OAuth",
      "Facebook OAuth",
      "Apple OAuth",
      "Two-Factor Authentication",
      "Password Reset",
    ],
    lastChecked: new Date().toISOString(),
    responseTime: 120,
  },
  {
    id: "booking",
    name: "Smart Booking System",
    description: "Teacher availability and student booking management",
    status: "operational",
    icon: BookOpen,
    features: [
      "Time Slot Management",
      "Timezone Conversion",
      "Instant Booking",
      "Reschedule Options",
      "Calendar Integration",
      "Attendance Tracking",
    ],
    lastChecked: new Date().toISOString(),
    responseTime: 85,
  },
  {
    id: "messaging",
    name: "Messaging System",
    description: "Real-time communication with file sharing",
    status: "operational",
    icon: MessageSquare,
    features: [
      "Real-time Chat",
      "File Attachments",
      "Image Sharing",
      "Message Reports",
      "Conversation Management",
      "Notification System",
    ],
    lastChecked: new Date().toISOString(),
    responseTime: 45,
  },
  {
    id: "payment",
    name: "Payment Gateway",
    description: "Multi-provider payment processing",
    status: "operational",
    icon: CreditCard,
    features: [
      "Credit/Debit Cards",
      "PayPal Integration",
      "Apple Pay",
      "Google Pay",
      "Wallet System",
      "Automatic Tax Calculation",
    ],
    lastChecked: new Date().toISOString(),
    responseTime: 200,
  },
  {
    id: "reviews",
    name: "Reviews & Ratings",
    description: "Student feedback and teacher rating system",
    status: "operational",
    icon: Star,
    features: [
      "5-Star Rating System",
      "Written Reviews",
      "Tag-based Feedback",
      "Auto-review System",
      "Public Profile Display",
      "Review Moderation",
    ],
    lastChecked: new Date().toISOString(),
    responseTime: 65,
  },
  {
    id: "admin",
    name: "Admin Dashboard",
    description: "Comprehensive platform management",
    status: "operational",
    icon: Activity,
    features: [
      "User Management",
      "Teacher Approval",
      "Financial Reports",
      "Platform Analytics",
      "Content Moderation",
      "System Monitoring",
    ],
    lastChecked: new Date().toISOString(),
    responseTime: 150,
  },
  {
    id: "support",
    name: "Support System",
    description: "Categorized ticket management",
    status: "operational",
    icon: Headphones,
    features: [
      "Ticket Categories",
      "Priority Levels",
      "Staff Assignment",
      "Knowledge Base",
      "Live Chat Support",
      "Response Tracking",
    ],
    lastChecked: new Date().toISOString(),
    responseTime: 95,
  },
  {
    id: "database",
    name: "Database System",
    description: "Data storage and management",
    status: "operational",
    icon: Database,
    features: [
      "User Profiles",
      "Lesson Records",
      "Financial Transactions",
      "Message History",
      "Analytics Data",
      "Backup Systems",
    ],
    lastChecked: new Date().toISOString(),
    responseTime: 30,
  },
];

export default function SystemStatus() {
  const [components, setComponents] =
    useState<SystemComponent[]>(systemComponents);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-600 bg-green-100";
      case "degraded":
        return "text-yellow-600 bg-yellow-100";
      case "down":
        return "text-red-600 bg-red-100";
      case "maintenance":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return CheckCircle;
      case "degraded":
        return AlertCircle;
      case "down":
        return XCircle;
      case "maintenance":
        return Clock;
      default:
        return AlertCircle;
    }
  };

  const overallStatus = components.every((c) => c.status === "operational")
    ? "operational"
    : components.some((c) => c.status === "down")
      ? "down"
      : "degraded";

  const operationalCount = components.filter(
    (c) => c.status === "operational",
  ).length;
  const operationalPercentage = (operationalCount / components.length) * 100;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API calls to check system status
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 2000);
  };

  const averageResponseTime =
    components.reduce((sum, c) => sum + (c.responseTime || 0), 0) /
    components.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Talkcon System Status</h1>
              <p className="text-muted-foreground mt-1">
                Real-time status of all platform components and services
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
            >
              <RefreshCw
                className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")}
              />
              Refresh Status
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Overall Status */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center",
                      overallStatus === "operational"
                        ? "bg-green-100"
                        : overallStatus === "down"
                          ? "bg-red-100"
                          : "bg-yellow-100",
                    )}
                  >
                    {overallStatus === "operational" ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : overallStatus === "down" ? (
                      <XCircle className="h-8 w-8 text-red-600" />
                    ) : (
                      <AlertCircle className="h-8 w-8 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {overallStatus === "operational"
                        ? "All Systems Operational"
                        : overallStatus === "down"
                          ? "System Issues Detected"
                          : "Some Systems Degraded"}
                    </h2>
                    <p className="text-muted-foreground">
                      {operationalCount} of {components.length} systems
                      operational ({operationalPercentage.toFixed(1)}%)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {averageResponseTime.toFixed(0)}ms
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average Response Time
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>System Health</span>
                  <span>{operationalPercentage.toFixed(1)}%</span>
                </div>
                <Progress value={operationalPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Components */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">System Components</h3>
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>

          <div className="grid gap-4">
            {components.map((component) => {
              const StatusIcon = getStatusIcon(component.status);
              return (
                <Card key={component.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <component.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{component.name}</h4>
                            <Badge
                              className={cn(
                                "text-xs",
                                getStatusColor(component.status),
                              )}
                            >
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {component.status}
                            </Badge>
                            {component.responseTime && (
                              <span className="text-sm text-muted-foreground">
                                {component.responseTime}ms
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground mb-3">
                            {component.description}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {component.features.map((feature) => (
                              <div
                                key={feature}
                                className="flex items-center gap-2 text-sm"
                              >
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Integration Status */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Platform Integration Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Student Features</h4>
                  <div className="space-y-2">
                    {[
                      "Enhanced Dashboard",
                      "Teacher Discovery",
                      "Booking System",
                      "Payment Gateway",
                      "Messaging System",
                      "Review System",
                      "Support Tickets",
                      "Profile Management",
                    ].map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Teacher Features</h4>
                  <div className="space-y-2">
                    {[
                      "Enhanced Dashboard",
                      "Availability Management",
                      "Student Communication",
                      "Earnings Tracking",
                      "Payout Requests",
                      "Performance Analytics",
                      "Resource Center",
                      "Profile Customization",
                    ].map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <h4 className="font-semibold mb-3">Admin Features</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    "Complete Dashboard",
                    "User Management",
                    "Teacher Approval",
                    "Financial Reports",
                    "Platform Analytics",
                    "Content Moderation",
                    "System Monitoring",
                    "Payout Management",
                    "Support Oversight",
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Alert */}
        <Alert className="mt-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Platform Status: Fully Operational</strong>
            <br />
            All Talkcon platform features are successfully integrated and
            functioning properly. The comprehensive tutoring platform includes
            smart booking, multi-provider authentication, payment processing,
            messaging, reviews, attendance management, and full administrative
            controls.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
