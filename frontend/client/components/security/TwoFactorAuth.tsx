import React, { useState } from "react";
import { Shield, Smartphone, Copy, Check, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useToast } from "../ui/use-toast";

interface TwoFactorAuthProps {
  userId: string;
  isEnabled: boolean;
  onEnable: (secret: string, verificationCode: string) => Promise<boolean>;
  onDisable: (verificationCode: string) => Promise<boolean>;
  onVerify: (code: string) => Promise<boolean>;
}

export function TwoFactorAuth({
  userId,
  isEnabled,
  onEnable,
  onDisable,
  onVerify,
}: TwoFactorAuthProps) {
  const { toast } = useToast();
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [setupStep, setSetupStep] = useState(1);
  const [qrSecret, setQrSecret] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [secretCopied, setSecretCopied] = useState(false);

  // Generate QR code secret and backup codes
  const generateTwoFAData = () => {
    // In a real app, this would call the backend to generate a proper secret
    const secret = `TALKCON${Math.random().toString(36).substr(2, 16).toUpperCase()}`;
    const codes = Array.from({ length: 8 }, () =>
      Math.random().toString(36).substr(2, 8),
    );

    setQrSecret(secret);
    setBackupCodes(codes);
    return { secret, codes };
  };

  const handleSetupStart = () => {
    generateTwoFAData();
    setSetupStep(1);
    setIsSetupOpen(true);
  };

  const handleVerifyAndEnable = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await onEnable(qrSecret, verificationCode);
      if (success) {
        toast({
          title: "2FA Enabled! 🔐",
          description:
            "Your account is now protected with two-factor authentication",
        });
        setIsSetupOpen(false);
        setVerificationCode("");
        setSetupStep(1);
      } else {
        toast({
          title: "Verification Failed",
          description: "Invalid verification code. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "Failed to enable 2FA. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDisable = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code to disable 2FA",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await onDisable(verificationCode);
      if (success) {
        toast({
          title: "2FA Disabled",
          description: "Two-factor authentication has been disabled",
        });
        setVerificationCode("");
      } else {
        toast({
          title: "Verification Failed",
          description: "Invalid verification code. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to Disable",
        description: "Failed to disable 2FA. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(qrSecret);
    setSecretCopied(true);
    setTimeout(() => setSecretCopied(false), 2000);
    toast({
      title: "Secret Copied",
      description: "Manual setup key copied to clipboard",
    });
  };

  const downloadBackupCodes = () => {
    const codesText = backupCodes.join("\n");
    const blob = new Blob([codesText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "talkcon-backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Backup Codes Downloaded",
      description: "Store these codes in a safe place",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Security Status</h4>
              <p className="text-sm text-muted-foreground">
                {isEnabled
                  ? "Your account is protected with 2FA"
                  : "Add an extra layer of security to your account"}
              </p>
            </div>
            <Badge variant={isEnabled ? "default" : "secondary"}>
              {isEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>

          {isEnabled ? (
            <div className="space-y-3">
              <Alert>
                <Check className="h-4 w-4" />
                <AlertDescription>
                  Two-factor authentication is active. You'll need your
                  authenticator app to sign in.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Enter verification code to disable 2FA
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                  <Button
                    variant="destructive"
                    onClick={handleDisable}
                    disabled={verificationCode.length !== 6}
                  >
                    Disable 2FA
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Button onClick={handleSetupStart} className="w-full">
              <Smartphone className="h-4 w-4 mr-2" />
              Enable Two-Factor Authentication
            </Button>
          )}
        </div>

        {/* Setup Dialog */}
        <Dialog open={isSetupOpen} onOpenChange={setIsSetupOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Setup Two-Factor Authentication</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {setupStep === 1 && (
                <div className="space-y-4">
                  <Alert>
                    <Smartphone className="h-4 w-4" />
                    <AlertDescription>
                      You'll need an authenticator app like Google Authenticator
                      or Authy to complete this setup.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <h4 className="font-medium">Step 1: Scan QR Code</h4>
                    <div className="bg-muted p-4 rounded-lg text-center">
                      {/* In a real app, this would show an actual QR code */}
                      <div className="w-32 h-32 mx-auto bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-500">QR Code</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">
                        Can't scan? Enter this code manually:
                      </h5>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">
                          {qrSecret}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={copySecret}
                        >
                          {secretCopied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => setSetupStep(2)} className="w-full">
                    I've Added the Code
                  </Button>
                </div>
              )}

              {setupStep === 2 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Step 2: Verify Setup</h4>
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code from your authenticator app to verify
                    the setup.
                  </p>

                  <div className="space-y-3">
                    <Input
                      type="text"
                      placeholder="000000"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                    />

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setSetupStep(1)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleVerifyAndEnable}
                        disabled={verificationCode.length !== 6}
                        className="flex-1"
                      >
                        Verify & Enable
                      </Button>
                    </div>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Save your backup codes after enabling 2FA. You'll need
                      them if you lose access to your authenticator app.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {setupStep === 3 && (
                <div className="space-y-4">
                  <Alert>
                    <Check className="h-4 w-4" />
                    <AlertDescription>
                      2FA has been successfully enabled! Save these backup codes
                      in a secure location.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <h4 className="font-medium">Backup Codes</h4>
                    <div className="grid grid-cols-2 gap-2 p-3 bg-muted rounded-lg">
                      {backupCodes.map((code, index) => (
                        <code
                          key={index}
                          className="text-sm font-mono text-center"
                        >
                          {code}
                        </code>
                      ))}
                    </div>

                    <Button
                      onClick={downloadBackupCodes}
                      variant="outline"
                      className="w-full"
                    >
                      Download Backup Codes
                    </Button>
                  </div>

                  <Button
                    onClick={() => {
                      setIsSetupOpen(false);
                      setSetupStep(1);
                      setVerificationCode("");
                    }}
                    className="w-full"
                  >
                    Complete Setup
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// Report Content Component
export function ReportContent({
  contentId,
  contentType,
  onReport,
}: {
  contentId: string;
  contentType: "message" | "file" | "profile";
  onReport: (reason: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const { toast } = useToast();

  const handleReport = () => {
    if (!reason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for reporting this content",
        variant: "destructive",
      });
      return;
    }

    onReport(reason);
    setIsOpen(false);
    setReason("");

    toast({
      title: "Content Reported",
      description:
        "Thank you for your report. We'll review it within 24 hours.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700"
        >
          <AlertTriangle className="h-4 w-4 mr-1" />
          Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Report Content</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please help us understand why you're reporting this {contentType}.
              False reports may result in account restrictions.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for reporting</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please describe the issue..."
              className="w-full p-3 border rounded-md resize-none"
              rows={4}
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReport}
              disabled={!reason.trim()}
              className="flex-1"
            >
              Submit Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TwoFactorAuth;
