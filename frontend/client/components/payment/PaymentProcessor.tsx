import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Wallet,
  Smartphone,
  Shield,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Lock,
  Clock,
  DollarSign,
  ArrowRight,
  Receipt,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { Separator } from "../ui/separator";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Progress } from "../ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useAuth } from "../../contexts/AuthContext";
import { PLATFORM_CONFIG } from "../../api/config";
import { PaymentMethod, Booking } from "../../types/platform";
import { cn } from "../../lib/utils";

interface PaymentProcessorProps {
  amount: number;
  currency?: string;
  description: string;
  booking?: Booking;
  paymentMethods: PaymentMethod[];
  onPaymentSuccess: (paymentId: string, receipt: PaymentReceipt) => void;
  onPaymentError: (error: string) => void;
  className?: string;
}

interface PaymentReceipt {
  id: string;
  amount: number;
  currency: string;
  description: string;
  paymentMethod: string;
  timestamp: string;
  breakdown: {
    subtotal: number;
    tax: number;
    commission: number;
    total: number;
  };
}

interface PaymentStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

export function PaymentProcessor({
  amount,
  currency = "USD",
  description,
  booking,
  paymentMethods,
  onPaymentSuccess,
  onPaymentError,
  className,
}: PaymentProcessorProps) {
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState<PaymentReceipt | null>(
    null,
  );
  const [saveForFuture, setSaveForFuture] = useState(false);

  // Calculate payment breakdown
  const subtotal = amount;
  const tax = subtotal * PLATFORM_CONFIG.VAT_RATE;
  const commission = subtotal * PLATFORM_CONFIG.COMMISSION_RATE;
  const total = subtotal + tax;

  const steps: PaymentStep[] = [
    {
      id: 1,
      title: "Payment Method",
      description: "Choose how you want to pay",
      completed: !!selectedMethod,
      active: currentStep === 1,
    },
    {
      id: 2,
      title: "Review & Confirm",
      description: "Review your payment details",
      completed: currentStep > 2,
      active: currentStep === 2,
    },
    {
      id: 3,
      title: "Processing",
      description: "Secure payment processing",
      completed: currentStep > 3,
      active: currentStep === 3,
    },
  ];

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case "visa":
      case "mastercard":
        return CreditCard;
      case "paypal":
        return Wallet;
      case "apple_pay":
      case "google_pay":
      case "wechat_pay":
        return Smartphone;
      default:
        return CreditCard;
    }
  };

  const getPaymentMethodColor = (type: string) => {
    switch (type) {
      case "visa":
        return "text-blue-600";
      case "mastercard":
        return "text-red-600";
      case "paypal":
        return "text-blue-700";
      case "apple_pay":
        return "text-gray-800";
      case "google_pay":
        return "text-green-600";
      case "wechat_pay":
        return "text-green-500";
      default:
        return "text-gray-600";
    }
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const simulatePaymentProcess = async () => {
    const selectedPaymentMethod = paymentMethods.find(
      (m) => m.id === selectedMethod,
    );
    if (!selectedPaymentMethod) return;

    setProcessing(true);
    setCurrentStep(3);

    try {
      // Simulate payment processing time
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Generate mock receipt
      const receipt: PaymentReceipt = {
        id: `pay_${Date.now()}`,
        amount: total,
        currency,
        description,
        paymentMethod: selectedPaymentMethod.type,
        timestamp: new Date().toISOString(),
        breakdown: {
          subtotal,
          tax,
          commission,
          total,
        },
      };

      setPaymentReceipt(receipt);
      setShowReceipt(true);
      onPaymentSuccess(receipt.id, receipt);
    } catch (error: any) {
      onPaymentError(error.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!selectedMethod;
      case 2:
        return true;
      case 3:
        return false; // Processing step
      default:
        return false;
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                step.completed
                  ? "bg-primary border-primary text-primary-foreground"
                  : step.active
                    ? "border-primary text-primary"
                    : "border-muted text-muted-foreground",
              )}
            >
              {step.completed ? (
                <CheckCircle className="w-5 h-5" />
              ) : processing && step.active ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                step.id
              )}
            </div>
            <div className="text-center mt-2">
              <p
                className={cn(
                  "text-sm font-medium",
                  step.active ? "text-primary" : "text-muted-foreground",
                )}
              >
                {step.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-0.5 mx-4 mt-5",
                step.completed ? "bg-primary" : "bg-muted",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderPaymentMethodStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
        <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = getPaymentMethodIcon(method.type);
              const colorClass = getPaymentMethodColor(method.type);

              return (
                <div
                  key={method.id}
                  className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50"
                >
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Icon className={cn("w-5 h-5", colorClass)} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {method.type === "visa"
                              ? "Visa"
                              : method.type === "mastercard"
                                ? "Mastercard"
                                : method.type === "paypal"
                                  ? "PayPal"
                                  : method.type === "apple_pay"
                                    ? "Apple Pay"
                                    : method.type === "google_pay"
                                      ? "Google Pay"
                                      : method.type === "wechat_pay"
                                        ? "WeChat Pay"
                                        : method.type}
                          </span>
                          {method.isDefault && (
                            <Badge variant="outline" className="text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {method.type === "visa" ||
                          method.type === "mastercard"
                            ? `**** **** **** ${method.last4}`
                            : method.email || "Mobile payment"}
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
              );
            })}
          </div>
        </RadioGroup>
      </div>

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Your payment is secured with 256-bit SSL encryption and processed
          through certified payment gateways.
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderReviewStep = () => {
    const selectedPaymentMethod = paymentMethods.find(
      (m) => m.id === selectedMethod,
    );
    if (!selectedPaymentMethod) return null;

    const Icon = getPaymentMethodIcon(selectedPaymentMethod.type);
    const colorClass = getPaymentMethodColor(selectedPaymentMethod.type);

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Review Payment</h3>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>{description}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>VAT ({PLATFORM_CONFIG.VAT_RATE * 100}%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>
                  ${total.toFixed(2)} {currency}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Selected Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Icon className={cn("w-5 h-5", colorClass)} />
                <div>
                  <p className="font-medium">
                    {selectedPaymentMethod.type === "visa"
                      ? "Visa"
                      : selectedPaymentMethod.type === "mastercard"
                        ? "Mastercard"
                        : selectedPaymentMethod.type === "paypal"
                          ? "PayPal"
                          : selectedPaymentMethod.type === "apple_pay"
                            ? "Apple Pay"
                            : selectedPaymentMethod.type === "google_pay"
                              ? "Google Pay"
                              : selectedPaymentMethod.type === "wechat_pay"
                                ? "WeChat Pay"
                                : selectedPaymentMethod.type}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedPaymentMethod.type === "visa" ||
                    selectedPaymentMethod.type === "mastercard"
                      ? `**** **** **** ${selectedPaymentMethod.last4}`
                      : selectedPaymentMethod.email || "Mobile payment"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Payment Method Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="saveForFuture"
              checked={saveForFuture}
              onCheckedChange={setSaveForFuture}
            />
            <Label htmlFor="saveForFuture" className="text-sm">
              Save this payment method for future transactions
            </Label>
          </div>
        </div>

        {/* Terms and Conditions */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            By proceeding with this payment, you agree to our Terms of Service
            and Payment Policy.
            {booking && " This payment is for a confirmed lesson booking."}
          </AlertDescription>
        </Alert>
      </div>
    );
  };

  const renderProcessingStep = () => (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
        <p className="text-muted-foreground">
          Please wait while we securely process your payment. Do not close this
          window.
        </p>
      </div>
      <Progress value={75} className="max-w-md mx-auto" />
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Lock className="w-4 h-4" />
        <span>Secure SSL Connection</span>
      </div>
    </div>
  );

  return (
    <>
      <Card className={cn("max-w-2xl mx-auto", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Payment Checkout
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepIndicator()}

          <div className="min-h-[400px]">
            {currentStep === 1 && renderPaymentMethodStep()}
            {currentStep === 2 && renderReviewStep()}
            {currentStep === 3 && renderProcessingStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={currentStep === 1 || processing}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {currentStep < 3 && (
                <Button
                  onClick={
                    currentStep === 2 ? simulatePaymentProcess : handleNextStep
                  }
                  disabled={!canProceed() || processing}
                >
                  {currentStep === 2 ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Pay ${total.toFixed(2)}
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Payment Successful
            </DialogTitle>
          </DialogHeader>

          {paymentReceipt && (
            <div className="space-y-4">
              <Alert>
                <Receipt className="h-4 w-4" />
                <AlertDescription>
                  Your payment has been processed successfully. A confirmation
                  email has been sent to your account.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Receipt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="font-mono">{paymentReceipt.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>
                      {new Date(paymentReceipt.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="capitalize">
                      {paymentReceipt.paymentMethod.replace("_", " ")}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${paymentReceipt.breakdown.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${paymentReceipt.breakdown.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Paid:</span>
                    <span>
                      ${paymentReceipt.breakdown.total.toFixed(2)}{" "}
                      {paymentReceipt.currency}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowReceipt(false)}>
                  Close
                </Button>
                <Button>Download Receipt</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PaymentProcessor;
