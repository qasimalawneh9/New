import React, { useState } from "react";
import {
  CreditCard,
  Plus,
  Trash2,
  Check,
  Star,
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
  Smartphone,
  Wallet,
  Building,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Alert, AlertDescription } from "../ui/alert";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PaymentMethod } from "../../types/platform";
import { cn } from "../../lib/utils";

interface PaymentMethodsProps {
  paymentMethods: PaymentMethod[];
  onAddPaymentMethod: (method: Partial<PaymentMethod>) => void;
  onRemovePaymentMethod: (methodId: string) => void;
  onSetDefaultMethod: (methodId: string) => void;
  className?: string;
}

interface NewPaymentMethod {
  type:
    | "visa"
    | "mastercard"
    | "paypal"
    | "apple_pay"
    | "google_pay"
    | "wechat_pay";
  cardNumber?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cvv?: string;
  cardholderName?: string;
  email?: string;
  phoneNumber?: string;
  isDefault: boolean;
}

export function PaymentMethods({
  paymentMethods,
  onAddPaymentMethod,
  onRemovePaymentMethod,
  onSetDefaultMethod,
  className,
}: PaymentMethodsProps) {
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState<
    Record<string, boolean>
  >({});
  const [newMethod, setNewMethod] = useState<NewPaymentMethod>({
    type: "visa",
    isDefault: false,
  });

  const paymentProviders = [
    {
      id: "visa",
      name: "Visa",
      icon: CreditCard,
      color: "text-blue-600",
      description: "Credit/Debit Card",
      setupFields: [
        "cardNumber",
        "expiryMonth",
        "expiryYear",
        "cvv",
        "cardholderName",
      ],
    },
    {
      id: "mastercard",
      name: "Mastercard",
      icon: CreditCard,
      color: "text-red-600",
      description: "Credit/Debit Card",
      setupFields: [
        "cardNumber",
        "expiryMonth",
        "expiryYear",
        "cvv",
        "cardholderName",
      ],
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: Wallet,
      color: "text-blue-700",
      description: "Digital Wallet",
      setupFields: ["email"],
    },
    {
      id: "apple_pay",
      name: "Apple Pay",
      icon: Smartphone,
      color: "text-gray-800",
      description: "Mobile Payment",
      setupFields: [],
    },
    {
      id: "google_pay",
      name: "Google Pay",
      icon: Smartphone,
      color: "text-green-600",
      description: "Mobile Payment",
      setupFields: [],
    },
    {
      id: "wechat_pay",
      name: "WeChat Pay",
      icon: Smartphone,
      color: "text-green-500",
      description: "Mobile Payment",
      setupFields: ["phoneNumber"],
    },
  ];

  const getProviderInfo = (type: string) => {
    return paymentProviders.find((p) => p.id === type) || paymentProviders[0];
  };

  const toggleCardDetails = (methodId: string) => {
    setShowCardDetails((prev) => ({
      ...prev,
      [methodId]: !prev[methodId],
    }));
  };

  const handleAddMethod = async () => {
    try {
      await onAddPaymentMethod(newMethod);
      setShowAddMethod(false);
      setNewMethod({
        type: "visa",
        isDefault: false,
      });
    } catch (error) {
      console.error("Failed to add payment method:", error);
    }
  };

  const handleSetDefault = async (methodId: string) => {
    try {
      await onSetDefaultMethod(methodId);
    } catch (error) {
      console.error("Failed to set default method:", error);
    }
  };

  const handleRemoveMethod = async (methodId: string) => {
    if (
      window.confirm("Are you sure you want to remove this payment method?")
    ) {
      try {
        await onRemovePaymentMethod(methodId);
      } catch (error) {
        console.error("Failed to remove payment method:", error);
      }
    }
  };

  const renderPaymentMethodCard = (method: PaymentMethod) => {
    const provider = getProviderInfo(method.type);
    const Icon = provider.icon;
    const showDetails = showCardDetails[method.id];

    return (
      <Card key={method.id} className="relative">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gray-100`}>
                <Icon className={cn("w-6 h-6", provider.color)} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{provider.name}</h3>
                  {method.isDefault && (
                    <Badge variant="default" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Default
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {method.type === "visa" || method.type === "mastercard"
                    ? `**** **** **** ${method.last4}`
                    : method.email || provider.description}
                </p>
                {(method.type === "visa" || method.type === "mastercard") &&
                  method.expiryMonth &&
                  method.expiryYear && (
                    <p className="text-xs text-muted-foreground">
                      Expires {method.expiryMonth.toString().padStart(2, "0")}/
                      {method.expiryYear}
                    </p>
                  )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {(method.type === "visa" || method.type === "mastercard") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCardDetails(method.id)}
                >
                  {showDetails ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              )}

              {!method.isDefault && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSetDefault(method.id)}
                >
                  Set Default
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveMethod(method.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Expanded Card Details */}
          {showDetails &&
            (method.type === "visa" || method.type === "mastercard") && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Card Number
                    </Label>
                    <p className="font-mono">**** **** **** {method.last4}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Expiry
                    </Label>
                    <p>
                      {method.expiryMonth?.toString().padStart(2, "0")}/
                      {method.expiryYear}
                    </p>
                  </div>
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    );
  };

  const renderAddMethodForm = () => {
    const provider = getProviderInfo(newMethod.type);
    const isCardType =
      newMethod.type === "visa" || newMethod.type === "mastercard";
    const isMobileType = ["apple_pay", "google_pay", "wechat_pay"].includes(
      newMethod.type,
    );

    return (
      <div className="space-y-4">
        <div>
          <Label>Payment Provider</Label>
          <Select
            value={newMethod.type}
            onValueChange={(value: any) =>
              setNewMethod((prev) => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {paymentProviders.map((provider) => (
                <SelectItem key={provider.id} value={provider.id}>
                  <div className="flex items-center gap-2">
                    <provider.icon className={cn("w-4 h-4", provider.color)} />
                    <span>{provider.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({provider.description})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Card-specific fields */}
        {isCardType && (
          <>
            <div>
              <Label>Cardholder Name</Label>
              <Input
                placeholder="John Doe"
                value={newMethod.cardholderName || ""}
                onChange={(e) =>
                  setNewMethod((prev) => ({
                    ...prev,
                    cardholderName: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label>Card Number</Label>
              <Input
                placeholder="1234 5678 9012 3456"
                value={newMethod.cardNumber || ""}
                onChange={(e) =>
                  setNewMethod((prev) => ({
                    ...prev,
                    cardNumber: e.target.value,
                  }))
                }
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Expiry Month</Label>
                <Select
                  value={newMethod.expiryMonth?.toString() || ""}
                  onValueChange={(value) =>
                    setNewMethod((prev) => ({
                      ...prev,
                      expiryMonth: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(
                      (month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {month.toString().padStart(2, "0")}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Expiry Year</Label>
                <Select
                  value={newMethod.expiryYear?.toString() || ""}
                  onValueChange={(value) =>
                    setNewMethod((prev) => ({
                      ...prev,
                      expiryYear: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="YY" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      { length: 10 },
                      (_, i) => new Date().getFullYear() + i,
                    ).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year.toString().slice(-2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>CVV</Label>
                <Input
                  placeholder="123"
                  value={newMethod.cvv || ""}
                  onChange={(e) =>
                    setNewMethod((prev) => ({ ...prev, cvv: e.target.value }))
                  }
                  maxLength={4}
                />
              </div>
            </div>
          </>
        )}

        {/* PayPal-specific fields */}
        {newMethod.type === "paypal" && (
          <div>
            <Label>PayPal Email</Label>
            <Input
              placeholder="user@example.com"
              type="email"
              value={newMethod.email || ""}
              onChange={(e) =>
                setNewMethod((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
        )}

        {/* WeChat Pay-specific fields */}
        {newMethod.type === "wechat_pay" && (
          <div>
            <Label>Phone Number</Label>
            <Input
              placeholder="+1 (555) 123-4567"
              value={newMethod.phoneNumber || ""}
              onChange={(e) =>
                setNewMethod((prev) => ({
                  ...prev,
                  phoneNumber: e.target.value,
                }))
              }
            />
          </div>
        )}

        {/* Mobile payment info */}
        {isMobileType && newMethod.type !== "wechat_pay" && (
          <Alert>
            <Smartphone className="h-4 w-4" />
            <AlertDescription>
              {newMethod.type === "apple_pay"
                ? "You'll be redirected to authenticate with Touch ID or Face ID."
                : "You'll be redirected to authenticate with your Google account."}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="setDefault"
            checked={newMethod.isDefault}
            onCheckedChange={(checked) =>
              setNewMethod((prev) => ({ ...prev, isDefault: !!checked }))
            }
          />
          <Label htmlFor="setDefault" className="text-sm">
            Set as default payment method
          </Label>
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Your payment information is encrypted and stored securely. We never
            store your CVV.
          </AlertDescription>
        </Alert>
      </div>
    );
  };

  return (
    <>
      <div className={cn("space-y-6", className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Payment Methods</h2>
            <p className="text-muted-foreground">
              Manage your payment methods for seamless transactions
            </p>
          </div>

          <Button onClick={() => setShowAddMethod(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Method
          </Button>
        </div>

        {/* Payment Methods List */}
        {paymentMethods.length === 0 ? (
          <Card>
            <CardContent className="pt-8 pb-8 text-center">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No payment methods</h3>
              <p className="text-muted-foreground mb-4">
                Add a payment method to start making transactions
              </p>
              <Button onClick={() => setShowAddMethod(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Method
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {paymentMethods.map(renderPaymentMethodCard)}
          </div>
        )}

        {/* Supported Providers */}
        <Card>
          <CardHeader>
            <CardTitle>Supported Payment Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {paymentProviders.map((provider) => {
                const Icon = provider.icon;
                const isAdded = paymentMethods.some(
                  (m) => m.type === provider.id,
                );

                return (
                  <div
                    key={provider.id}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <Icon className={cn("w-6 h-6", provider.color)} />
                    <div className="flex-1">
                      <p className="font-medium">{provider.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {provider.description}
                      </p>
                    </div>
                    {isAdded && (
                      <Badge variant="outline" className="text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        Added
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Security:</strong> All payment information is encrypted
            using industry-standard SSL technology. We comply with PCI DSS
            standards and never store sensitive card details on our servers.
          </AlertDescription>
        </Alert>
      </div>

      {/* Add Payment Method Dialog */}
      <Dialog open={showAddMethod} onOpenChange={setShowAddMethod}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
          </DialogHeader>

          {renderAddMethodForm()}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowAddMethod(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddMethod}
              disabled={
                (newMethod.type === "paypal" && !newMethod.email) ||
                ((newMethod.type === "visa" ||
                  newMethod.type === "mastercard") &&
                  (!newMethod.cardNumber ||
                    !newMethod.expiryMonth ||
                    !newMethod.expiryYear ||
                    !newMethod.cvv))
              }
            >
              Add Payment Method
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PaymentMethods;
