import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Mail,
  CheckCircle,
  Globe,
  MessageCircle,
} from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate email
    if (!email) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsSubmitted(true);
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-background to-red-100 flex items-center justify-center p-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-800/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-3">
              <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-red-900 shadow-lg transform rotate-3">
                <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-red-500/90 to-red-800/90">
                  <div className="absolute top-1.5 left-1.5 w-3.5 h-3 bg-white/90 rounded-sm"></div>
                  <div className="absolute top-3.5 right-1.5 w-3 h-2.5 bg-white/70 rounded-sm"></div>
                  <div className="absolute bottom-2 left-2 w-2.5 h-2 bg-white/50 rounded-sm"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white font-bold text-base leading-none">
                      T
                    </div>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full shadow-sm"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-800 to-red-900 bg-clip-text text-transparent">
                Talkcon
              </span>
            </Link>
          </div>

          <Card className="shadow-xl border-0 bg-background/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>

              <h1 className="text-2xl font-bold mb-4">Check Your Email</h1>
              <p className="text-muted-foreground mb-6">
                We've sent a password reset link to{" "}
                <span className="font-medium text-foreground">{email}</span>
              </p>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="text-primary hover:underline"
                  >
                    try again
                  </button>
                </p>

                <div className="pt-4 border-t">
                  <Link
                    to="/login"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-background to-red-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-800/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3">
            <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-red-900 shadow-lg transform rotate-3">
              <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-red-500/90 to-red-800/90">
                <div className="absolute top-1.5 left-1.5 w-3.5 h-3 bg-white/90 rounded-sm"></div>
                <div className="absolute top-3.5 right-1.5 w-3 h-2.5 bg-white/70 rounded-sm"></div>
                <div className="absolute bottom-2 left-2 w-2.5 h-2 bg-white/50 rounded-sm"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white font-bold text-base leading-none">
                    T
                  </div>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full shadow-sm"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-red-800 to-red-900 bg-clip-text text-transparent">
              Talkcon
            </span>
          </Link>
        </div>

        <Card className="shadow-xl border-0 bg-background/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Reset Your Password</CardTitle>
            <p className="text-muted-foreground">
              Enter your email address and we'll send you a link to reset your
              password
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              Need help?{" "}
              <Link to="/contact" className="text-primary hover:underline">
                Contact Support
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
