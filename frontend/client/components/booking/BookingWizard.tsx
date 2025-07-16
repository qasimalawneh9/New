import React, { useState, useEffect } from "react";
import {
  Clock,
  Calendar as CalendarIcon,
  User,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Info,
  CreditCard,
  Shield,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar } from "../ui/calendar";
import { useAuth } from "../../contexts/AuthContext";
import { PLATFORM_CONFIG } from "../../api/config";
import { BookingForm, PaymentProvider } from "../../types/platform";
import { cn } from "../../lib/utils";

interface BookingWizardProps {
  teacherId: string;
  teacherName: string;
  teacherHourlyRate: number;
  teacherRating: number;
  availableDurations: number[];
  onSuccess: (booking: any) => void;
  onCancel: () => void;
  className?: string;
}

interface BookingData {
  teacherId: string;
  lessonType: "individual" | "group" | "trial";
  duration: number;
  packageQuantity?: number;
  selectedDate?: Date;
  selectedTimeSlot?: string;
  meetingPlatform: string;
  notes?: string;
  paymentMethod: PaymentProvider;
  acceptedPolicies: {
    terms: boolean;
    cancellation: boolean;
    rescheduling: boolean;
    privacy: boolean;
  };
}

enum BookingStep {
  TEACHER_SELECTION = 1,
  LESSON_DETAILS = 2,
  SCHEDULING = 3,
  PAYMENT = 4,
  CONFIRMATION = 5,
}

export function BookingWizard({
  teacherId,
  teacherName,
  teacherHourlyRate,
  teacherRating,
  availableDurations,
  onSuccess,
  onCancel,
  className,
}: BookingWizardProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<BookingStep>(
    BookingStep.TEACHER_SELECTION,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [bookingData, setBookingData] = useState<BookingData>({
    teacherId,
    lessonType: "individual",
    duration: availableDurations[0] || 60,
    meetingPlatform: "zoom",
    paymentMethod: "stripe" as PaymentProvider,
    acceptedPolicies: {
      terms: false,
      cancellation: false,
      rescheduling: false,
      privacy: false,
    },
  });

  const [priceCalculation, setPriceCalculation] = useState<any>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  // Calculate pricing based on current selections
  useEffect(() => {
    calculatePrice();
  }, [
    bookingData.lessonType,
    bookingData.duration,
    bookingData.packageQuantity,
  ]);

  const calculatePrice = () => {
    const basePrice = (teacherHourlyRate / 60) * bookingData.duration;
    const quantity = bookingData.packageQuantity || 1;

    // Apply discounts for packages
    let discount = 0;
    if (quantity >= 10)
      discount = 0.15; // 15% off for 10+ lessons
    else if (quantity >= 5) discount = 0.1; // 10% off for 5+ lessons

    // Apply group lesson discount
    const adjustedPrice =
      bookingData.lessonType === "group" ? basePrice * 0.7 : basePrice;

    const subtotal = adjustedPrice * quantity * (1 - discount);
    const taxAmount = subtotal * PLATFORM_CONFIG.VAT_RATE;
    const total = subtotal + taxAmount;
    const commission = subtotal * PLATFORM_CONFIG.COMMISSION_RATE;
    const teacherEarnings = subtotal - commission;

    setPriceCalculation({
      basePrice: basePrice.toFixed(2),
      adjustedPrice: adjustedPrice.toFixed(2),
      subtotal: subtotal.toFixed(2),
      discount: (subtotal * discount).toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      total: total.toFixed(2),
      commission: commission.toFixed(2),
      teacherEarnings: teacherEarnings.toFixed(2),
      quantity,
      discountPercentage: discount * 100,
    });
  };

  const updateBookingData = (updates: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < BookingStep.CONFIRMATION) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > BookingStep.TEACHER_SELECTION) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToNextStep = (): boolean => {
    switch (currentStep) {
      case BookingStep.TEACHER_SELECTION:
        return true; // Teacher already selected
      case BookingStep.LESSON_DETAILS:
        return bookingData.duration > 0;
      case BookingStep.SCHEDULING:
        return !!(bookingData.selectedDate && bookingData.selectedTimeSlot);
      case BookingStep.PAYMENT:
        return Object.values(bookingData.acceptedPolicies).every(
          (accepted) => accepted,
        );
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (currentStep !== BookingStep.CONFIRMATION) {
      if (canProceedToNextStep()) {
        nextStep();
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Call booking API
      const booking = {
        id: `booking_${Date.now()}`,
        ...bookingData,
        studentId: user?.id,
        status: "pending",
        totalPrice: priceCalculation.total,
        createdAt: new Date().toISOString(),
      };

      onSuccess(booking);
    } catch (err: any) {
      setError(err.message || "Failed to create booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case BookingStep.TEACHER_SELECTION:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
                <User className="w-5 h-5" />
                Selected Teacher
              </h3>
            </div>

            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{teacherName}</h4>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>${teacherHourlyRate}/hour</span>
                    <Badge variant="secondary">⭐ {teacherRating}</Badge>
                    <Badge variant="outline">Verified</Badge>
                  </div>
                </div>
              </div>
            </Card>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                You've selected {teacherName} as your teacher. Ready to proceed
                with lesson details?
              </AlertDescription>
            </Alert>
          </div>
        );

      case BookingStep.LESSON_DETAILS:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Lesson Details
            </h3>

            {/* Lesson Type */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Lesson Type</Label>
              <RadioGroup
                value={bookingData.lessonType}
                onValueChange={(value: "individual" | "group" | "trial") =>
                  updateBookingData({ lessonType: value })
                }
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50">
                  <RadioGroupItem value="trial" id="trial" />
                  <Label htmlFor="trial" className="flex-1 cursor-pointer">
                    <div className="font-medium">Trial Lesson (30 min)</div>
                    <div className="text-sm text-muted-foreground">
                      Get to know your teacher - $15 fixed price
                    </div>
                  </Label>
                  <Badge variant="secondary">Most Popular</Badge>
                </div>

                <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual" className="flex-1 cursor-pointer">
                    <div className="font-medium">1-on-1 Lesson</div>
                    <div className="text-sm text-muted-foreground">
                      Private lesson with {teacherName} - ${teacherHourlyRate}
                      /hour
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50">
                  <RadioGroupItem value="group" id="group" />
                  <Label htmlFor="group" className="flex-1 cursor-pointer">
                    <div className="font-medium">
                      Group Lesson (Max 4 Students)
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Join other students - $
                      {Math.round(teacherHourlyRate * 0.7)}/hour per person
                    </div>
                  </Label>
                  <Badge variant="outline">30% Off</Badge>
                </div>
              </RadioGroup>
            </div>

            {/* Duration */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Duration</Label>
              <RadioGroup
                value={bookingData.duration.toString()}
                onValueChange={(value) =>
                  updateBookingData({ duration: parseInt(value) })
                }
                className="grid grid-cols-2 gap-3"
              >
                {PLATFORM_CONFIG.LESSON_DURATIONS.map((duration) => (
                  <div
                    key={duration}
                    className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-gray-50"
                  >
                    <RadioGroupItem
                      value={duration.toString()}
                      id={`duration-${duration}`}
                    />
                    <Label
                      htmlFor={`duration-${duration}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">{duration} minutes</div>
                      <div className="text-sm text-muted-foreground">
                        ${((teacherHourlyRate / 60) * duration).toFixed(2)}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Package Options (for non-trial lessons) */}
            {bookingData.lessonType !== "trial" && (
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Package Options (Optional)
                </Label>
                <Select
                  value={bookingData.packageQuantity?.toString() || "1"}
                  onValueChange={(value) =>
                    updateBookingData({ packageQuantity: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Single Lesson</SelectItem>
                    <SelectItem value="5">5 Lessons (10% off)</SelectItem>
                    <SelectItem value="10">10 Lessons (15% off)</SelectItem>
                    <SelectItem value="20">20 Lessons (20% off)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Meeting Platform */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Preferred Meeting Platform
              </Label>
              <Select
                value={bookingData.meetingPlatform}
                onValueChange={(value) =>
                  updateBookingData({ meetingPlatform: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORM_CONFIG.SUPPORTED_MEETING_PLATFORMS.map(
                    (platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case BookingStep.SCHEDULING:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Scheduling
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-medium mb-3 block">
                  Select Date
                </Label>
                <Calendar
                  mode="single"
                  selected={bookingData.selectedDate}
                  onSelect={(date) => updateBookingData({ selectedDate: date })}
                  disabled={(date) =>
                    date < new Date() ||
                    date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                  }
                  className="border rounded-md"
                />
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">
                  Available Times
                </Label>
                {bookingData.selectedDate ? (
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {[
                      "09:00",
                      "10:00",
                      "11:00",
                      "14:00",
                      "15:00",
                      "16:00",
                      "17:00",
                      "18:00",
                    ].map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={
                          bookingData.selectedTimeSlot === time
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          updateBookingData({ selectedTimeSlot: time })
                        }
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Please select a date first
                  </p>
                )}
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Special Requests (Optional)
              </Label>
              <Textarea
                placeholder="Tell your teacher what you'd like to focus on, your learning goals, or any specific requirements..."
                value={bookingData.notes || ""}
                onChange={(e) => updateBookingData({ notes: e.target.value })}
                rows={3}
              />
            </div>

            {/* Scheduling Policies Alert */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important Scheduling Policies:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    You can reschedule up to 72 hours before the lesson (maximum
                    1 reschedule per booking)
                  </li>
                  <li>
                    Cancellations must be made at least 48 hours in advance for
                    a full refund
                  </li>
                  <li>
                    Late cancellations (less than 48 hours) are subject to a 50%
                    fee
                  </li>
                  <li>No-shows will be charged the full lesson fee</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        );

      case BookingStep.PAYMENT:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Payment & Policies
            </h3>

            {/* Price Summary */}
            {priceCalculation && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Price Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Lesson Type:</span>
                    <span className="capitalize">{bookingData.lessonType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{bookingData.duration} minutes</span>
                  </div>
                  {bookingData.packageQuantity &&
                    bookingData.packageQuantity > 1 && (
                      <div className="flex justify-between">
                        <span>Lessons:</span>
                        <span>{priceCalculation.quantity}</span>
                      </div>
                    )}
                  <Separator />
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${priceCalculation.subtotal}</span>
                  </div>
                  {priceCalculation.discountPercentage > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>
                        Package Discount ({priceCalculation.discountPercentage}
                        %):
                      </span>
                      <span>-${priceCalculation.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>VAT (10%):</span>
                    <span>${priceCalculation.taxAmount}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${priceCalculation.total}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Teacher receives: ${priceCalculation.teacherEarnings} (after{" "}
                    {PLATFORM_CONFIG.COMMISSION_RATE * 100}% platform
                    commission)
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Payment Method */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Payment Method</Label>
              <RadioGroup
                value={bookingData.paymentMethod}
                onValueChange={(value: PaymentProvider) =>
                  updateBookingData({ paymentMethod: value })
                }
                className="space-y-3"
              >
                {PLATFORM_CONFIG.SUPPORTED_PAYMENT_PROVIDERS.map((provider) => (
                  <div
                    key={provider}
                    className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-gray-50"
                  >
                    <RadioGroupItem value={provider} id={provider} />
                    <Label htmlFor={provider} className="flex-1 cursor-pointer">
                      <div className="font-medium">
                        {provider === "stripe" && (
                          <>
                            <CreditCard className="inline w-4 h-4 mr-2" />
                            Credit/Debit Card
                          </>
                        )}
                        {provider === "paypal" && "PayPal"}
                        {provider === "apple_pay" && "Apple Pay"}
                        {provider === "google_pay" && "Google Pay"}
                        {provider === "wechat_pay" && "WeChat Pay"}
                      </div>
                    </Label>
                    {provider === "stripe" && (
                      <Badge variant="secondary">Recommended</Badge>
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Policy Acceptance */}
            <div className="space-y-4">
              <Label className="text-base font-medium">
                Policy Acceptance (Required)
              </Label>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={bookingData.acceptedPolicies.terms}
                    onCheckedChange={(checked) =>
                      updateBookingData({
                        acceptedPolicies: {
                          ...bookingData.acceptedPolicies,
                          terms: !!checked,
                        },
                      })
                    }
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    I agree to the{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-primary underline"
                    >
                      Terms of Service
                    </Button>{" "}
                    and understand the platform commission structure.
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="cancellation"
                    checked={bookingData.acceptedPolicies.cancellation}
                    onCheckedChange={(checked) =>
                      updateBookingData({
                        acceptedPolicies: {
                          ...bookingData.acceptedPolicies,
                          cancellation: !!checked,
                        },
                      })
                    }
                  />
                  <Label
                    htmlFor="cancellation"
                    className="text-sm leading-relaxed"
                  >
                    I understand the{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-primary underline"
                    >
                      Cancellation Policy
                    </Button>{" "}
                    (48-hour notice required for full refund).
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="rescheduling"
                    checked={bookingData.acceptedPolicies.rescheduling}
                    onCheckedChange={(checked) =>
                      updateBookingData({
                        acceptedPolicies: {
                          ...bookingData.acceptedPolicies,
                          rescheduling: !!checked,
                        },
                      })
                    }
                  />
                  <Label
                    htmlFor="rescheduling"
                    className="text-sm leading-relaxed"
                  >
                    I understand the{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-primary underline"
                    >
                      Rescheduling Policy
                    </Button>{" "}
                    (72-hour notice, maximum 1 reschedule per booking).
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacy"
                    checked={bookingData.acceptedPolicies.privacy}
                    onCheckedChange={(checked) =>
                      updateBookingData({
                        acceptedPolicies: {
                          ...bookingData.acceptedPolicies,
                          privacy: !!checked,
                        },
                      })
                    }
                  />
                  <Label htmlFor="privacy" className="text-sm leading-relaxed">
                    I agree to the{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-primary underline"
                    >
                      Privacy Policy
                    </Button>{" "}
                    and consent to data processing for lesson delivery.
                  </Label>
                </div>
              </div>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your payment information is processed securely. We never store
                your payment details.
              </AlertDescription>
            </Alert>
          </div>
        );

      case BookingStep.CONFIRMATION:
        return (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                Confirm Your Booking
              </h3>
              <p className="text-muted-foreground">
                Please review your booking details before confirming.
              </p>
            </div>

            <Card className="text-left">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Teacher:</span>
                  <span className="font-medium">{teacherName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lesson Type:</span>
                  <span className="capitalize">{bookingData.lessonType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{bookingData.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span>
                    {bookingData.selectedDate?.toLocaleDateString()} at{" "}
                    {bookingData.selectedTimeSlot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Platform:</span>
                  <span className="capitalize">
                    {bookingData.meetingPlatform}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="capitalize">
                    {bookingData.paymentMethod.replace("_", " ")}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount:</span>
                  <span>${priceCalculation?.total}</span>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                After confirming, you'll receive a booking confirmation email
                with the meeting link and teacher contact information.
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={cn("max-w-4xl mx-auto", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Book a Lesson</span>
          <Badge variant="outline">
            Step {currentStep} of {BookingStep.CONFIRMATION}
          </Badge>
        </CardTitle>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(currentStep / BookingStep.CONFIRMATION) * 100}%`,
            }}
          />
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {renderStepContent()}

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t mt-6">
          <div>
            {currentStep > BookingStep.TEACHER_SELECTION && (
              <Button type="button" variant="outline" onClick={previousStep}>
                Previous
              </Button>
            )}
          </div>

          <div className="space-x-2">
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={!canProceedToNextStep() || isLoading}
            >
              {isLoading
                ? "Processing..."
                : currentStep === BookingStep.CONFIRMATION
                  ? "Confirm & Pay"
                  : "Next"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BookingWizard;
