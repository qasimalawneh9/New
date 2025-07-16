/**
 * Booking Form Component
 *
 * This component handles lesson booking and maps to Laravel BookingController.
 * Features semantic IDs and classes for easy backend integration.
 */

import React, { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  DollarSign,
  Loader2,
  CheckCircle,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { bookingService } from "@/api/services/booking.service";

// Booking form data interface - matches Laravel validation rules
interface BookingFormData {
  teacher_id: string;
  lesson_type: "individual" | "group";
  duration: number;
  scheduled_at: string;
  package_quantity?: number;
  notes?: string;
  payment_method: "wallet" | "paypal" | "stripe";
}

// Component props
interface BookingFormProps {
  teacherId: string;
  teacherName: string;
  teacherHourlyRate: number;
  availableDurations: number[];
  onSuccess?: (booking: any) => void;
  onCancel?: () => void;
  className?: string;
}

// Booking step enum
enum BookingStep {
  LESSON_TYPE = 1,
  DURATION = 2,
  PACKAGE = 3,
  SCHEDULE = 4,
  PAYMENT = 5,
}

/**
 * BookingForm Component
 *
 * Semantic IDs and classes for Laravel integration:
 * - Form ID: 'booking-form' → maps to Laravel route 'bookings.store'
 * - Step IDs: 'booking-step-{number}' → for multi-step form tracking
 * - Field IDs: match Laravel form field names
 * - Data attributes: provide backend integration points
 */
export const BookingForm: React.FC<BookingFormProps> = ({
  teacherId,
  teacherName,
  teacherHourlyRate,
  availableDurations,
  onSuccess,
  onCancel,
  className = "",
}) => {
  // Hooks
  const { user } = useAuth();

  // Form state
  const [currentStep, setCurrentStep] = useState<BookingStep>(
    BookingStep.LESSON_TYPE,
  );
  const [formData, setFormData] = useState<BookingFormData>({
    teacher_id: teacherId,
    lesson_type: "individual",
    duration: availableDurations[0] || 60,
    scheduled_at: "",
    notes: "",
    payment_method: "wallet",
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [priceCalculation, setPriceCalculation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [error, setError] = useState<string | null>(null);

  // Calculate pricing when form data changes
  useEffect(() => {
    calculatePrice();
  }, [formData.lesson_type, formData.duration, formData.package_quantity]);

  // Load available time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      loadAvailableTimeSlots();
    }
  }, [selectedDate]);

  // Calculate lesson price
  const calculatePrice = async () => {
    try {
      const pricing = await bookingService.calculatePrice({
        teacher_id: teacherId,
        lesson_type: formData.lesson_type,
        duration: formData.duration,
        package_quantity: formData.package_quantity,
      });
      setPriceCalculation(pricing);
    } catch (error) {
      console.error("Price calculation error:", error);
    }
  };

  // Load available time slots for selected date
  const loadAvailableTimeSlots = async () => {
    if (!selectedDate) return;

    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const availability = await bookingService.getTeacherAvailability(
        teacherId,
        {
          from: dateStr,
          to: dateStr,
        },
      );

      const slots = availability.available_slots.map((slot) =>
        new Date(slot.start_time).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );

      setAvailableTimeSlots(slots);
    } catch (error) {
      console.error("Failed to load time slots:", error);
      setAvailableTimeSlots([]);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof BookingFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle step navigation
  const goToStep = (step: BookingStep) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    if (currentStep < BookingStep.PAYMENT) {
      // Skip package step for individual lessons
      if (
        currentStep === BookingStep.DURATION &&
        formData.lesson_type === "individual"
      ) {
        setCurrentStep(BookingStep.SCHEDULE);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const previousStep = () => {
    if (currentStep > BookingStep.LESSON_TYPE) {
      // Skip package step for individual lessons when going back
      if (
        currentStep === BookingStep.SCHEDULE &&
        formData.lesson_type === "individual"
      ) {
        setCurrentStep(BookingStep.DURATION);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (currentStep !== BookingStep.PAYMENT) {
      nextStep();
      return;
    }

    setIsLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      // Combine date and time for scheduled_at
      if (selectedDate && selectedTimeSlot) {
        const [hours, minutes] = selectedTimeSlot.split(":").map(Number);
        const scheduledDate = new Date(selectedDate);
        scheduledDate.setHours(hours, minutes, 0, 0);
        formData.scheduled_at = scheduledDate.toISOString();
      }

      // Create booking
      const booking = await bookingService.createBooking(formData);

      // Process payment if required
      if (priceCalculation?.total_price > 0) {
        await bookingService.processPayment(booking.id, {
          payment_method: formData.payment_method,
        });
      }

      // Handle success
      if (onSuccess) {
        onSuccess(booking);
      }
    } catch (error: any) {
      setError(error.message);
      if (error.validationErrors) {
        setValidationErrors(error.validationErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get field error message
  const getFieldError = (field: string): string | undefined => {
    return validationErrors[field]?.[0];
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case BookingStep.LESSON_TYPE:
        return (
          <div
            id="booking-step-lesson-type"
            className="booking-form__step"
            data-step="lesson-type"
            data-step-number="1"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Step 1: Select Lesson Type
            </h3>

            <RadioGroup
              value={formData.lesson_type}
              onValueChange={(value: "individual" | "group") =>
                handleInputChange("lesson_type", value)
              }
              className="space-y-4"
              data-field="lesson_type"
            >
              <div
                className="booking-form__option flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50"
                data-option="individual"
              >
                <RadioGroupItem
                  value="individual"
                  id="lesson-type-individual"
                />
                <Label
                  htmlFor="lesson-type-individual"
                  className="flex-1 cursor-pointer"
                >
                  <div className="font-medium">1-on-1 Lesson</div>
                  <div className="text-sm text-muted-foreground">
                    Private lesson with {teacherName} - ${teacherHourlyRate}
                    /hour
                  </div>
                </Label>
                <Badge variant="secondary">Recommended</Badge>
              </div>

              <div
                className="booking-form__option flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50"
                data-option="group"
              >
                <RadioGroupItem value="group" id="lesson-type-group" />
                <Label
                  htmlFor="lesson-type-group"
                  className="flex-1 cursor-pointer"
                >
                  <div className="font-medium">
                    Group Lesson (Max 4 Students)
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Join other students - ${Math.round(teacherHourlyRate * 0.7)}
                    /hour per person
                  </div>
                </Label>
                <Badge variant="outline">30% Off</Badge>
              </div>
            </RadioGroup>
          </div>
        );

      case BookingStep.DURATION:
        return (
          <div
            id="booking-step-duration"
            className="booking-form__step"
            data-step="duration"
            data-step-number="2"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Step 2: Select Duration
            </h3>

            <RadioGroup
              value={formData.duration.toString()}
              onValueChange={(value) =>
                handleInputChange("duration", parseInt(value))
              }
              className="grid grid-cols-2 gap-4"
              data-field="duration"
            >
              {availableDurations.map((duration) => (
                <div
                  key={duration}
                  className="booking-form__option flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50"
                  data-option={`duration-${duration}`}
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
                      ${Math.round((teacherHourlyRate / 60) * duration)}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case BookingStep.PACKAGE:
        if (formData.lesson_type === "individual") return null;

        return (
          <div
            id="booking-step-package"
            className="booking-form__step"
            data-step="package"
            data-step-number="3"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Step 3: Package Quantity (Optional)
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="package-quantity">
                  Number of Lessons (5-25)
                </Label>
                <Input
                  id="package-quantity"
                  type="number"
                  min="5"
                  max="25"
                  value={formData.package_quantity || 1}
                  onChange={(e) =>
                    handleInputChange(
                      "package_quantity",
                      parseInt(e.target.value),
                    )
                  }
                  className="mt-1"
                  data-field="package_quantity"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Book multiple lessons for better rates
                </p>
              </div>
            </div>
          </div>
        );

      case BookingStep.SCHEDULE:
        return (
          <div
            id="booking-step-schedule"
            className="booking-form__step"
            data-step="schedule"
            data-step-number="4"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2" />
              Step 4: Select Date & Time
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="block mb-2">Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="border rounded-md"
                  data-field="selected_date"
                />
              </div>

              <div>
                <Label className="block mb-2">Available Times</Label>
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {availableTimeSlots.map((timeSlot) => (
                    <Button
                      key={timeSlot}
                      type="button"
                      variant={
                        selectedTimeSlot === timeSlot ? "default" : "outline"
                      }
                      className="text-sm"
                      onClick={() => setSelectedTimeSlot(timeSlot)}
                      data-time-slot={timeSlot}
                    >
                      {timeSlot}
                    </Button>
                  ))}
                </div>

                {availableTimeSlots.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No available time slots for this date
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="booking-notes">Special Requests (Optional)</Label>
              <Textarea
                id="booking-notes"
                placeholder="Tell the teacher what you'd like to focus on..."
                value={formData.notes || ""}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="mt-1"
                data-field="notes"
              />
            </div>
          </div>
        );

      case BookingStep.PAYMENT:
        return (
          <div
            id="booking-step-payment"
            className="booking-form__step"
            data-step="payment"
            data-step-number="5"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Step 5: Payment & Summary
            </h3>

            {/* Price Summary */}
            {priceCalculation && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Price Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{formData.duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lesson Type:</span>
                    <span className="capitalize">{formData.lesson_type}</span>
                  </div>
                  {formData.package_quantity && (
                    <div className="flex justify-between">
                      <span>Lessons:</span>
                      <span>{formData.package_quantity}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${priceCalculation.base_price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%):</span>
                    <span>${priceCalculation.tax_amount}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${priceCalculation.total_price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Teacher receives: ${priceCalculation.teacher_earnings}{" "}
                    (after 20% commission)
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Payment Method */}
            <div>
              <Label className="block mb-2">Payment Method</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value: any) =>
                  handleInputChange("payment_method", value)
                }
                data-field="payment_method"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wallet">Wallet Balance</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="stripe">Credit/Debit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card
      id="booking-form-container"
      className={`booking-form-container w-full max-w-4xl mx-auto ${className}`}
      data-component="booking-form"
      data-laravel-controller="BookingController"
      data-laravel-action="store"
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Book a Lesson with {teacherName}</span>
          <Badge variant="outline">
            Step {currentStep} of {BookingStep.PAYMENT}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Global error alert */}
        {error && (
          <Alert className="mb-4" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form
          id="booking-form"
          className="booking-form space-y-6"
          onSubmit={handleSubmit}
          data-form-type="booking"
          data-form-action="create"
          data-current-step={currentStep}
        >
          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="booking-form__navigation flex justify-between pt-6 border-t">
            <div>
              {currentStep > BookingStep.LESSON_TYPE && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={previousStep}
                  data-action="previous-step"
                >
                  Previous
                </Button>
              )}
            </div>

            <div className="space-x-2">
              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                  data-action="cancel-booking"
                >
                  Cancel
                </Button>
              )}

              <Button
                type="submit"
                disabled={
                  isLoading ||
                  (currentStep === BookingStep.SCHEDULE &&
                    (!selectedDate || !selectedTimeSlot))
                }
                data-action={
                  currentStep === BookingStep.PAYMENT
                    ? "confirm-booking"
                    : "next-step"
                }
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : currentStep === BookingStep.PAYMENT ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm & Pay
                  </>
                ) : (
                  "Next Step"
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
