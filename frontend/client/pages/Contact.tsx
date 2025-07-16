import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Globe,
  Users,
  BookOpen,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Footer } from "@/components/ui/footer";

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitted(true);
    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      detail: "Available 24/7",
      action: "Start Chat",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      detail: "support@linguaconnect.com",
      action: "Send Email",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak with our team directly",
      detail: "+1 (555) 123-4567",
      action: "Call Now",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const offices = [
    {
      city: "New York",
      address: "123 Broadway, Suite 456\nNew York, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "ny@linguaconnect.com",
    },
    {
      city: "London",
      address: "45 Oxford Street\nLondon W1D 2DZ, UK",
      phone: "+44 20 7123 4567",
      email: "london@linguaconnect.com",
    },
    {
      city: "Tokyo",
      address: "1-2-3 Shibuya\nTokyo 150-0002, Japan",
      phone: "+81 3 1234 5678",
      email: "tokyo@linguaconnect.com",
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">
              Message Sent Successfully!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for contacting us. Our support team will get back to you
              within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => setIsSubmitted(false)}>
                Send Another Message
              </Button>
              <Button variant="outline">Visit Help Center</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Get in
              <span className="text-primary"> Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Have a question, need support, or want to share feedback? Our team
              is here to help you succeed in your language learning journey.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Choose How to Reach Us
              </h2>
              <p className="text-lg text-muted-foreground">
                Multiple ways to get the help you need
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {contactMethods.map((method, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-8">
                    <div
                      className={`w-16 h-16 ${method.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <method.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {method.title}
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      {method.description}
                    </p>
                    <p className="text-sm font-medium text-primary mb-4">
                      {method.detail}
                    </p>
                    <Button variant="outline" className="w-full">
                      {method.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
                <p className="text-muted-foreground mb-8">
                  Fill out the form below and we'll get back to you as soon as
                  possible. The more details you provide, the better we can
                  assist you.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-sm">
                      Response time: Within 2 hours during business hours
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="text-sm">
                      Multilingual support available
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-primary" />
                    <span className="text-sm">
                      24/7 support for urgent issues
                    </span>
                  </div>
                </div>
              </div>

              <Card>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleInputChange("category", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">
                            General Inquiry
                          </SelectItem>
                          <SelectItem value="technical">
                            Technical Support
                          </SelectItem>
                          <SelectItem value="billing">
                            Billing & Payments
                          </SelectItem>
                          <SelectItem value="lesson">Lesson Issues</SelectItem>
                          <SelectItem value="teacher">
                            Teacher Support
                          </SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="partnership">
                            Partnership Opportunities
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Brief description of your inquiry"
                        value={formData.subject}
                        onChange={(e) =>
                          handleInputChange("subject", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Please provide as much detail as possible to help us assist you better..."
                        rows={6}
                        value={formData.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Global Offices
              </h2>
              <p className="text-lg text-muted-foreground">
                We're here to support you around the world
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {offices.map((office, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-primary" />
                      {office.city}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Address
                        </p>
                        <p className="text-sm whitespace-pre-line">
                          {office.address}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Phone
                        </p>
                        <p className="text-sm">{office.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Email
                        </p>
                        <p className="text-sm text-primary">{office.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
