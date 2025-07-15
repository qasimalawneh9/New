import React, { useState } from "react";
import {
  CreditCard,
  Wallet,
  Shield,
  Check,
  X,
  DollarSign,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { PaymentMethod, WalletTransaction } from "../../types/platform";
import { cn } from "../../lib/utils";

interface PaymentGatewayProps {
  amount: number;
  currency: string;
  description: string;
  platformFeePercentage: number;
  taxPercentage: number;
  paymentMethods: PaymentMethod[];
  walletBalance: number;
  onPayment: (paymentData: PaymentData) => Promise<void>;
  onAddPaymentMethod: (method: PaymentMethod) => Promise<void>;
  loading?: boolean;
  className?: string;
}

interface PaymentData {
  method: "wallet" | "card" | "paypal" | "apple_pay" | "google_pay";
  paymentMethodId?: string;
  useWallet?: boolean;
  cardDetails?: {
    number: string;
    expiryMonth: number;
    expiryYear: number;
    cvc: string;
    name: string;
  };
}

export function PaymentGateway({
  amount,
  currency,
  description,
  platformFeePercentage,
  taxPercentage,
  paymentMethods,
  walletBalance,
  onPayment,
  onAddPaymentMethod,
  loading = false,
  className,
}: PaymentGatewayProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("wallet");
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] =
    useState<string>("");
  const [useWalletPartial, setUseWalletPartial] = useState(false);
  const [newCardData, setNewCardData] = useState({
    number: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
    name: "",
    saveCard: false,
  });
  const [processing, setProcessing] = useState(false);

  // Calculate fees and total
  const platformFee = amount * (platformFeePercentage / 100);
  const tax = (amount + platformFee) * (taxPercentage / 100);
  const totalAmount = amount + platformFee + tax;

  const walletPaymentPossible = walletBalance >= totalAmount;
  const partialWalletAmount = Math.min(walletBalance, totalAmount);
  const remainingAfterWallet = Math.max(0, totalAmount - walletBalance);

  const handlePayment = async () => {
    setProcessing(true);

    try {
      const paymentData: PaymentData = {
        method: selectedMethod as any,
        paymentMethodId: selectedPaymentMethodId || undefined,
        useWallet: useWalletPartial || selectedMethod === "wallet",
      };

      if (selectedMethod === "new_card") {
        paymentData.method = "card";
        paymentData.cardDetails = {
          number: newCardData.number,
          expiryMonth: parseInt(newCardData.expiryMonth),
          expiryYear: parseInt(newCardData.expiryYear),
          cvc: newCardData.cvc,
          name: newCardData.name,
        };
      }

      await onPayment(paymentData);
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const getCardType = (number: string) => {
    const num = number.replace(/\s/g, "");
    if (/^4/.test(num)) return "visa";
    if (/^5[1-5]/.test(num)) return "mastercard";
    if (/^3[47]/.test(num)) return "amex";
    return "unknown";
  };

  return (
    <div className={cn("max-w-2xl mx-auto space-y-6", className)}>
      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>{description}</span>
            <span>
              {currency} {amount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Platform fee ({platformFeePercentage}%)</span>
            <span>
              {currency} {platformFee.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Tax ({taxPercentage}%)</span>
            <span>
              {currency} {tax.toFixed(2)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total Amount</span>
            <span>
              {currency} {totalAmount.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Balance */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              <span className="font-medium">Wallet Balance</span>
            </div>
            <div className="text-right">
              <div className="font-bold">
                {currency} {walletBalance.toFixed(2)}
              </div>
              {walletPaymentPossible ? (
                <Badge variant="default" className="text-xs">
                  Sufficient balance
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  Partial payment possible
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedMethod} onValueChange={setSelectedMethod}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="digital">Digital</TabsTrigger>
            </TabsList>

            {/* Wallet Payment */}
            <TabsContent value="wallet" className="space-y-4 mt-4">
              {walletPaymentPossible ? (
                <Alert>
                  <Check className="h-4 w-4" />
                  <AlertDescription>
                    Your wallet has sufficient balance to complete this payment.
                  </AlertDescription>
                </Alert>
              ) : walletBalance > 0 ? (
                <div className="space-y-3">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Your wallet balance is insufficient. You can use{" "}
                      {currency} {partialWalletAmount.toFixed(2)} from your
                      wallet and pay the remaining {currency}{" "}
                      {remainingAfterWallet.toFixed(2)} with another method.
                    </AlertDescription>
                  </Alert>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="partial-wallet"
                      checked={useWalletPartial}
                      onChange={(e) => setUseWalletPartial(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="partial-wallet">
                      Use wallet balance ({currency}{" "}
                      {partialWalletAmount.toFixed(2)})
                    </Label>
                  </div>
                  {useWalletPartial && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm">
                        Remaining amount to pay: {currency}{" "}
                        {remainingAfterWallet.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Please select another payment method below.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <Alert variant="destructive">
                  <X className="h-4 w-4" />
                  <AlertDescription>
                    Your wallet balance is {currency} 0.00. Please choose
                    another payment method or top up your wallet.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* Card Payment */}
            <TabsContent value="cards" className="space-y-4 mt-4">
              <RadioGroup
                value={selectedPaymentMethodId}
                onValueChange={setSelectedPaymentMethodId}
              >
                {/* Saved Cards */}
                {paymentMethods
                  .filter((method) =>
                    ["visa", "mastercard"].includes(method.type),
                  )
                  .map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg"
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label
                        htmlFor={method.id}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5" />
                            <div>
                              <div className="font-medium">
                                •••• •••• •••• {method.last4}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {method.type.toUpperCase()} •{" "}
                                {method.expiryMonth}/{method.expiryYear}
                              </div>
                            </div>
                          </div>
                          {method.isDefault && (
                            <Badge variant="outline">Default</Badge>
                          )}
                        </div>
                      </Label>
                    </div>
                  ))}

                {/* Add New Card */}
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="new_card" id="new_card" />
                  <Label htmlFor="new_card" className="cursor-pointer">
                    Add new card
                  </Label>
                </div>
              </RadioGroup>

              {/* New Card Form */}
              {selectedMethod === "cards" &&
                selectedPaymentMethodId === "new_card" && (
                  <div className="space-y-4 p-4 bg-muted rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label>Card Number</Label>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          value={newCardData.number}
                          onChange={(e) =>
                            setNewCardData({
                              ...newCardData,
                              number: formatCardNumber(e.target.value),
                            })
                          }
                          maxLength={19}
                        />
                      </div>
                      <div>
                        <Label>Expiry Month</Label>
                        <Select
                          value={newCardData.expiryMonth}
                          onValueChange={(value) =>
                            setNewCardData({
                              ...newCardData,
                              expiryMonth: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem
                                key={i + 1}
                                value={String(i + 1).padStart(2, "0")}
                              >
                                {String(i + 1).padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Expiry Year</Label>
                        <Select
                          value={newCardData.expiryYear}
                          onValueChange={(value) =>
                            setNewCardData({
                              ...newCardData,
                              expiryYear: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="YYYY" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => {
                              const year = new Date().getFullYear() + i;
                              return (
                                <SelectItem key={year} value={String(year)}>
                                  {year}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>CVC</Label>
                        <Input
                          placeholder="123"
                          value={newCardData.cvc}
                          onChange={(e) =>
                            setNewCardData({
                              ...newCardData,
                              cvc: e.target.value.replace(/\D/g, ""),
                            })
                          }
                          maxLength={4}
                        />
                      </div>
                      <div>
                        <Label>Cardholder Name</Label>
                        <Input
                          placeholder="John Doe"
                          value={newCardData.name}
                          onChange={(e) =>
                            setNewCardData({
                              ...newCardData,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="save-card"
                        checked={newCardData.saveCard}
                        onChange={(e) =>
                          setNewCardData({
                            ...newCardData,
                            saveCard: e.target.checked,
                          })
                        }
                      />
                      <Label htmlFor="save-card">
                        Save card for future use
                      </Label>
                    </div>
                  </div>
                )}
            </TabsContent>

            {/* Digital Wallets */}
            <TabsContent value="digital" className="space-y-4 mt-4">
              <RadioGroup
                value={selectedPaymentMethodId}
                onValueChange={setSelectedPaymentMethodId}
              >
                {/* PayPal */}
                {paymentMethods
                  .filter((method) => method.type === "paypal")
                  .map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg"
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label
                        htmlFor={method.id}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                            PP
                          </div>
                          <div>
                            <div className="font-medium">PayPal</div>
                            <div className="text-sm text-muted-foreground">
                              {method.email}
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}

                {/* Apple Pay */}
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="apple_pay" id="apple_pay" />
                  <Label htmlFor="apple_pay" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-black rounded flex items-center justify-center text-white text-xs font-bold"></div>
                      <div>
                        <div className="font-medium">Apple Pay</div>
                        <div className="text-sm text-muted-foreground">
                          Touch ID or Face ID
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>

                {/* Google Pay */}
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="google_pay" id="google_pay" />
                  <Label htmlFor="google_pay" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-white border rounded flex items-center justify-center text-xs font-bold">
                        G
                      </div>
                      <div>
                        <div className="font-medium">Google Pay</div>
                        <div className="text-sm text-muted-foreground">
                          Secure payment with Google
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Your payment information is encrypted and secure. We use
          industry-standard security measures to protect your data.
        </AlertDescription>
      </Alert>

      {/* Pay Button */}
      <Button
        onClick={handlePayment}
        disabled={
          processing ||
          loading ||
          (!walletPaymentPossible &&
            selectedMethod === "wallet" &&
            !useWalletPartial) ||
          (selectedMethod !== "wallet" && !selectedPaymentMethodId)
        }
        className="w-full h-12 text-lg"
      >
        {processing ? (
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 animate-spin" />
            Processing Payment...
          </div>
        ) : (
          <>
            Pay {currency}{" "}
            {useWalletPartial
              ? remainingAfterWallet.toFixed(2)
              : totalAmount.toFixed(2)}
          </>
        )}
      </Button>
    </div>
  );
}

export default PaymentGateway;
