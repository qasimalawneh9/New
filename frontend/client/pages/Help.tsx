import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  BookOpen,
  MessageCircle,
  Video,
  CreditCard,
  Settings,
  HelpCircle,
  Clock,
  Users,
  Star,
  ChevronRight,
  Phone,
  Mail,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Footer } from "@/components/ui/footer";

const categories = [
  {
    icon: BookOpen,
    title: "Getting Started",
    description: "New to LinguaConnect? Start here",
    articles: 12,
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Video,
    title: "Lessons & Teaching",
    description: "Everything about lessons and video calls",
    articles: 18,
    color: "bg-green-100 text-green-600",
  },
  {
    icon: CreditCard,
    title: "Payments & Billing",
    description: "Payment methods, refunds, and billing",
    articles: 15,
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Settings,
    title: "Account & Settings",
    description: "Manage your account and preferences",
    articles: 10,
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: MessageCircle,
    title: "Communication",
    description: "Messaging, notifications, and support",
    articles: 8,
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: HelpCircle,
    title: "Troubleshooting",
    description: "Common issues and solutions",
    articles: 14,
    color: "bg-red-100 text-red-600",
  },
];

const popularArticles = [
  {
    title: "How to book your first lesson",
    category: "Getting Started",
    views: "15.2K",
    rating: 4.9,
  },
  {
    title: "Payment methods and refund policy",
    category: "Payments",
    views: "12.8K",
    rating: 4.8,
  },
  {
    title: "Technical requirements for video lessons",
    category: "Lessons",
    views: "10.5K",
    rating: 4.7,
  },
  {
    title: "How to reschedule or cancel a lesson",
    category: "Lessons",
    views: "9.3K",
    rating: 4.9,
  },
  {
    title: "Finding the right teacher for you",
    category: "Getting Started",
    views: "8.7K",
    rating: 4.8,
  },
];

const faqs = [
  {
    question: "How do I book a lesson?",
    answer:
      "Browse our teacher profiles, select your preferred teacher, choose an available time slot, and complete the booking process. You'll receive a confirmation email with lesson details.",
  },
  {
    question: "Can I cancel or reschedule a lesson?",
    answer:
      "Yes! You can reschedule lessons up to 4 hours before the scheduled time at no charge. Cancellations with less notice may incur a fee depending on your teacher's policy.",
  },
  {
    question: "What if I'm not satisfied with my lesson?",
    answer:
      "We offer a satisfaction guarantee. If you're not happy with your lesson, contact our support team within 24 hours and we'll provide a refund or credit.",
  },
  {
    question: "How do payments work?",
    answer:
      "Payments are processed securely through our platform. You can pay with credit cards, PayPal, or other supported methods. Payment is taken when you book a lesson.",
  },
  {
    question: "Do I need any special software?",
    answer:
      "No special software required! Our lessons run directly in your web browser. Just ensure you have a stable internet connection, camera, and microphone.",
  },
];

export default function Help() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              How can we
              <span className="text-primary"> help you?</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Find answers to your questions, learn how to use LinguaConnect,
              and get the support you need to succeed in your language learning
              journey.
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Browse by Category
              </h2>
              <p className="text-lg text-muted-foreground">
                Find help articles organized by topic
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg ${category.color}`}
                      >
                        <category.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-3">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">
                            {category.articles} articles
                          </Badge>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Popular Help Articles
              </h2>
              <p className="text-lg text-muted-foreground">
                Most viewed articles by our community
              </p>
            </div>
            <div className="space-y-4">
              {popularArticles.map((article, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-md transition-all cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <Badge variant="outline">{article.category}</Badge>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span>{article.rating}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{article.views} views</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Quick answers to common questions
              </p>
            </div>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Still Need Help?
              </h2>
              <p className="text-lg text-muted-foreground">
                Our support team is here to assist you
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Chat with our support team in real-time
                  </p>
                  <Badge variant="outline" className="mb-4">
                    <Clock className="w-3 h-3 mr-1" />
                    Available 24/7
                  </Badge>
                  <br />
                  <Button className="mt-4">Start Chat</Button>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Email Support</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Send us an email and we'll respond quickly
                  </p>
                  <Badge variant="outline" className="mb-4">
                    <Clock className="w-3 h-3 mr-1" />
                    Response in 2 hours
                  </Badge>
                  <br />
                  <Button variant="outline" className="mt-4" asChild>
                    <Link to="/contact">Send Email</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Speak directly with our support team
                  </p>
                  <Badge variant="outline" className="mb-4">
                    <Clock className="w-3 h-3 mr-1" />
                    Mon-Fri 9AM-6PM EST
                  </Badge>
                  <br />
                  <Button variant="outline" className="mt-4">
                    Call Us
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
