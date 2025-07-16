import React from "react";
import {
  AlertTriangle,
  Clock,
  DollarSign,
  RotateCcw,
  XCircle,
  Calendar,
  Shield,
  Info,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { PLATFORM_CONFIG } from "../../api/config";

interface BookingPoliciesProps {
  teacherName?: string;
  lessonPrice?: number;
  className?: string;
}

export function BookingPolicies({
  teacherName,
  lessonPrice,
  className,
}: BookingPoliciesProps) {
  const policies = [
    {
      icon: Clock,
      title: "Rescheduling Policy",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      rules: [
        {
          text: `You can reschedule up to ${PLATFORM_CONFIG.RESCHEDULE_WINDOW_HOURS} hours before the lesson`,
          icon: CheckCircle,
          color: "text-green-600",
        },
        {
          text: `Maximum ${PLATFORM_CONFIG.MAX_RESCHEDULES_PER_BOOKING} reschedule per booking`,
          icon: RotateCcw,
          color: "text-orange-600",
        },
        {
          text: "Rescheduling less than 72 hours before is not permitted",
          icon: XCircle,
          color: "text-red-600",
        },
        {
          text: "Teachers cannot reschedule within 24 hours without valid reason",
          icon: AlertTriangle,
          color: "text-amber-600",
        },
      ],
    },
    {
      icon: XCircle,
      title: "Cancellation Policy",
      color: "text-red-600",
      bgColor: "bg-red-50",
      rules: [
        {
          text: `Full refund for cancellations made ${PLATFORM_CONFIG.CANCELLATION_WINDOW_HOURS}+ hours in advance`,
          icon: CheckCircle,
          color: "text-green-600",
        },
        {
          text: "50% refund for cancellations made 24-48 hours before",
          icon: DollarSign,
          color: "text-orange-600",
        },
        {
          text: "No refund for cancellations made less than 24 hours before",
          icon: XCircle,
          color: "text-red-600",
        },
        {
          text: "No-shows will be charged the full lesson fee",
          icon: AlertTriangle,
          color: "text-red-600",
        },
      ],
    },
    {
      icon: DollarSign,
      title: "Payment & Pricing",
      color: "text-green-600",
      bgColor: "bg-green-50",
      rules: [
        {
          text: `Platform commission: ${PLATFORM_CONFIG.COMMISSION_RATE * 100}% of lesson fee`,
          icon: Info,
          color: "text-blue-600",
        },
        {
          text: `VAT: ${PLATFORM_CONFIG.VAT_RATE * 100}% added to student payments`,
          icon: DollarSign,
          color: "text-green-600",
        },
        {
          text: "Package discounts: 5 lessons (10% off), 10+ lessons (15% off)",
          icon: CheckCircle,
          color: "text-green-600",
        },
        {
          text: "Group lessons: 30% discount per student",
          icon: CheckCircle,
          color: "text-green-600",
        },
      ],
    },
    {
      icon: Calendar,
      title: "Attendance & Completion",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      rules: [
        {
          text: `Lessons auto-complete after ${PLATFORM_CONFIG.AUTO_COMPLETION_HOURS} hours if no student response`,
          icon: Clock,
          color: "text-purple-600",
        },
        {
          text: "Students have 24 hours to report lesson issues",
          icon: AlertTriangle,
          color: "text-orange-600",
        },
        {
          text: "Late arrivals (15+ minutes) may result in shortened lesson time",
          icon: Clock,
          color: "text-orange-600",
        },
        {
          text: "Attendance is automatically tracked when joining the lesson room",
          icon: CheckCircle,
          color: "text-green-600",
        },
      ],
    },
    {
      icon: Shield,
      title: "Teacher Accountability",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      rules: [
        {
          text: `Teachers suspended after ${PLATFORM_CONFIG.MAX_ABSENCES_BEFORE_SUSPENSION} unexcused absences`,
          icon: AlertTriangle,
          color: "text-red-600",
        },
        {
          text: "Teachers must provide 24-hour notice for emergency cancellations",
          icon: Clock,
          color: "text-orange-600",
        },
        {
          text: "Teacher no-shows result in automatic full refund to student",
          icon: CheckCircle,
          color: "text-green-600",
        },
        {
          text: "Repeated violations may result in permanent suspension",
          icon: XCircle,
          color: "text-red-600",
        },
      ],
    },
  ];

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Booking Policies & Guidelines
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Please review these important policies before booking your lesson
            {teacherName && ` with ${teacherName}`}.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Summary */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Quick Summary:</strong> Cancel/reschedule 72+ hours for
              full flexibility. Platform takes{" "}
              {PLATFORM_CONFIG.COMMISSION_RATE * 100}% commission. VAT (
              {PLATFORM_CONFIG.VAT_RATE * 100}%) applies to all payments.
            </AlertDescription>
          </Alert>

          {/* Detailed Policies */}
          <div className="grid gap-4">
            {policies.map((policy, index) => {
              const Icon = policy.icon;
              return (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className={`${policy.bgColor} pb-3`}>
                    <CardTitle
                      className={`flex items-center gap-2 ${policy.color}`}
                    >
                      <Icon className="w-5 h-5" />
                      {policy.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {policy.rules.map((rule, ruleIndex) => {
                        const RuleIcon = rule.icon;
                        return (
                          <div
                            key={ruleIndex}
                            className="flex items-start gap-3"
                          >
                            <RuleIcon
                              className={`w-4 h-4 mt-0.5 flex-shrink-0 ${rule.color}`}
                            />
                            <span className="text-sm leading-relaxed">
                              {rule.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Financial Breakdown Example */}
          {lessonPrice && (
            <Card className="bg-slate-50">
              <CardHeader>
                <CardTitle className="text-base">
                  Price Breakdown Example
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Lesson fee:</span>
                  <span>${lessonPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    Platform commission ({PLATFORM_CONFIG.COMMISSION_RATE * 100}
                    %):
                  </span>
                  <span>
                    $
                    {(lessonPrice * PLATFORM_CONFIG.COMMISSION_RATE).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>VAT ({PLATFORM_CONFIG.VAT_RATE * 100}%):</span>
                  <span>
                    ${(lessonPrice * PLATFORM_CONFIG.VAT_RATE).toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Student pays:</span>
                  <span>
                    ${(lessonPrice * (1 + PLATFORM_CONFIG.VAT_RATE)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Teacher receives:</span>
                  <span>
                    $
                    {(
                      lessonPrice *
                      (1 - PLATFORM_CONFIG.COMMISSION_RATE)
                    ).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Withdrawal Minimums */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Withdrawal Minimums (For Teachers)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">PayPal</Badge>
                  <span>Minimum ${PLATFORM_CONFIG.MIN_PAYPAL_WITHDRAWAL}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Bank Transfer</Badge>
                  <span>Minimum ${PLATFORM_CONFIG.MIN_BANK_WITHDRAWAL}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support SLA */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Support Response Times
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {Object.entries(PLATFORM_CONFIG.SUPPORT_SLA).map(
                  ([priority, hours]) => (
                    <div key={priority} className="flex justify-between">
                      <span className="capitalize font-medium">
                        {priority}:
                      </span>
                      <span>{hours}h response</span>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          {/* Legal Notice */}
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Legal Notice:</strong> By booking a lesson, you agree to
              these policies and our Terms of Service. Talkcon reserves the
              right to modify policies with 30-day notice. Disputes are subject
              to platform arbitration.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

export default BookingPolicies;
