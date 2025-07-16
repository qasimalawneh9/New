import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Search,
  BookOpen,
  Users,
  Video,
  Settings,
  CreditCard,
  Shield,
  FileText,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Globe,
  HeadphonesIcon,
  Zap,
  Star,
  Calendar,
  Camera,
  Mic,
} from "lucide-react";

const faqCategories = [
  { id: "getting-started", name: "Getting Started", count: 15 },
  { id: "payment", name: "Payment & Earnings", count: 12 },
  { id: "lessons", name: "Teaching Lessons", count: 18 },
  { id: "technology", name: "Technology Issues", count: 10 },
  { id: "policies", name: "Policies & Guidelines", count: 8 },
  { id: "profile", name: "Profile & Account", count: 14 },
];

const frequentlyAsked = [
  {
    category: "Getting Started",
    question: "How do I get approved as a teacher?",
    answer:
      "Complete your teacher application with all required documents, including teaching credentials, intro video, and profile photo. Our team reviews applications within 24-48 hours.",
  },
  {
    category: "Payment",
    question: "When and how do I get paid?",
    answer:
      "Payments are processed weekly on Fridays for lessons completed the previous week. You can choose from PayPal, bank transfer, or other payment methods in your region.",
  },
  {
    category: "Lessons",
    question: "What should I do if a student doesn't show up?",
    answer:
      "If a student is more than 15 minutes late without notice, you can mark the lesson as a no-show. You'll still receive payment, and the student will be charged.",
  },
  {
    category: "Technology",
    question: "What are the technical requirements for teaching?",
    answer:
      "You need a stable internet connection (minimum 10 Mbps), a computer with webcam and microphone, and a quiet teaching environment. We recommend using Chrome or Firefox browsers.",
  },
];

const supportChannels = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Get instant help from our support team",
    availability: "24/7",
    responseTime: "< 2 minutes",
    status: "available",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us a detailed message about your issue",
    availability: "24/7",
    responseTime: "< 4 hours",
    status: "available",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Talk directly with a support specialist",
    availability: "Mon-Fri 9AM-6PM EST",
    responseTime: "< 30 seconds",
    status: "available",
  },
  {
    icon: Video,
    title: "Video Call Support",
    description: "Screen sharing for technical issues",
    availability: "Mon-Fri 10AM-5PM EST",
    responseTime: "Schedule required",
    status: "available",
  },
];

const resources = [
  {
    icon: BookOpen,
    title: "Teacher Handbook",
    description: "Complete guide to teaching on our platform",
    link: "/teacher-resources",
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Step-by-step guides for common tasks",
    link: "/teacher-resources",
  },
  {
    icon: Users,
    title: "Teacher Community",
    description: "Connect with other teachers for advice",
    link: "/teacher-community",
  },
  {
    icon: FileText,
    title: "Best Practices",
    description: "Tips from our most successful teachers",
    link: "/teacher-resources",
  },
];

export default function TeacherSupport() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Teacher Support Center
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              We're here to help you succeed. Find answers, get support, and
              access resources to make your teaching journey smooth and
              successful.
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search for help..." className="pl-10" />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Quick Support Options */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Get Help Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <channel.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{channel.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {channel.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center">
                      <Badge
                        variant={
                          channel.status === "available"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {channel.status === "available"
                          ? "Available"
                          : "Offline"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {channel.availability}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Response: {channel.responseTime}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="faq" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="faq">FAQ</TabsTrigger>
                <TabsTrigger value="contact">Contact Us</TabsTrigger>
                <TabsTrigger value="status">System Status</TabsTrigger>
              </TabsList>

              <TabsContent value="faq" className="space-y-6">
                {/* FAQ Categories */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Browse by Category
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {faqCategories.map((category) => (
                      <Button
                        key={category.id}
                        variant="outline"
                        className="h-auto p-4 justify-between"
                      >
                        <span>{category.name}</span>
                        <Badge variant="secondary">{category.count}</Badge>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Frequently Asked Questions */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-4">
                    {frequentlyAsked.map((faq, index) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <HelpCircle className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-semibold">
                                  {faq.question}
                                </h4>
                                <Badge variant="outline">{faq.category}</Badge>
                              </div>
                              <p className="text-muted-foreground">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Send us a Message</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Issue Category</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Technical Issue</option>
                        <option>Payment Question</option>
                        <option>Account Problem</option>
                        <option>Lesson Support</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority Level</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Low - General question</option>
                        <option>Medium - Need help soon</option>
                        <option>High - Urgent issue</option>
                        <option>Critical - Cannot teach</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Describe Your Issue</Label>
                      <Textarea
                        id="message"
                        placeholder="Please provide as much detail as possible about your issue..."
                        rows={5}
                      />
                    </div>
                    <Button className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="status" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      All Systems Operational
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        service: "Video Calling",
                        status: "operational",
                        icon: Video,
                      },
                      {
                        service: "Payment Processing",
                        status: "operational",
                        icon: CreditCard,
                      },
                      {
                        service: "Lesson Booking",
                        status: "operational",
                        icon: Calendar,
                      },
                      {
                        service: "Teacher Dashboard",
                        status: "operational",
                        icon: Settings,
                      },
                      {
                        service: "Student Platform",
                        status: "operational",
                        icon: Users,
                      },
                      {
                        service: "Mobile Apps",
                        status: "operational",
                        icon: Globe,
                      },
                    ].map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <service.icon className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium">{service.service}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-600 capitalize">
                            {service.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Updates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        date: "Jan 20, 2024",
                        title: "Improved Video Quality",
                        description:
                          "Enhanced video compression for better call quality.",
                        type: "improvement",
                      },
                      {
                        date: "Jan 18, 2024",
                        title: "Payment Processing Fixed",
                        description:
                          "Resolved delay in teacher payment processing.",
                        type: "resolved",
                      },
                      {
                        date: "Jan 15, 2024",
                        title: "New Teacher Dashboard Features",
                        description:
                          "Added advanced analytics and scheduling tools.",
                        type: "feature",
                      },
                    ].map((update, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 border rounded-lg"
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            update.type === "resolved"
                              ? "bg-green-500"
                              : update.type === "improvement"
                                ? "bg-blue-500"
                                : "bg-purple-500"
                          }`}
                        ></div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{update.title}</h4>
                            <span className="text-xs text-muted-foreground">
                              {update.date}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {update.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Access */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Live Chat
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Request Call Back
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Video className="w-4 h-4 mr-2" />
                  Schedule Video Call
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Helpful Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {resources.map((resource, index) => (
                  <Link key={index} to={resource.link}>
                    <Button variant="ghost" className="w-full justify-start">
                      <resource.icon className="w-4 h-4 mr-2" />
                      {resource.title}
                    </Button>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">teachers@linguaconnect.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">24/7 Support</span>
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-xs text-muted-foreground">
                    Emergency technical support available outside business hours
                    for critical issues.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Feedback */}
            <Card>
              <CardHeader>
                <CardTitle>Help Us Improve</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Share your feedback to help us improve our support.
                </p>
                <Button variant="outline" className="w-full">
                  <Star className="w-4 h-4 mr-2" />
                  Give Feedback
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
