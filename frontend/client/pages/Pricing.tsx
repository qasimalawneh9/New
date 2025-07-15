import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Check,
  Star,
  Clock,
  Users,
  MessageCircle,
  Video,
  BookOpen,
  Award,
  Globe,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Footer } from "@/components/ui/footer";

export default function Pricing() {
  const { t } = useLanguage();
  const plans = [
    {
      name: "Trial Lesson",
      price: "$1",
      originalPrice: "$25",
      duration: "50 minutes",
      description: "Perfect for first-time students to try our platform",
      features: [
        "50-minute trial lesson",
        "Native speaker teacher",
        "Personalized feedback",
        "Learning plan creation",
        "No commitment required",
      ],
      popular: false,
      buttonText: "Book Trial",
      badge: "One-time offer",
    },
    {
      name: "Pay Per Lesson",
      price: "$15-50",
      duration: "per lesson",
      description: "Flexible pricing based on your chosen teacher",
      features: [
        "Choose your teacher",
        "Flexible scheduling",
        "50-minute lessons",
        "Lesson materials included",
        "Progress tracking",
        "Message your teacher anytime",
      ],
      popular: true,
      buttonText: "Find Teachers",
      badge: "Most popular",
    },
    {
      name: "Lesson Packages",
      price: "$200-400",
      duration: "10 lessons",
      description: "Save money with lesson packages from your favorite teacher",
      features: [
        "10-lesson packages",
        "5-15% discount",
        "Priority scheduling",
        "Extended teacher support",
        "Detailed progress reports",
        "Flexible validity period",
      ],
      popular: false,
      buttonText: "Browse Packages",
      badge: "Best value",
    },
  ];

  const features = [
    {
      icon: Video,
      title: "HD Video Lessons",
      description: "Crystal clear video calls with professional teachers",
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Book lessons 24/7 across all time zones",
    },
    {
      icon: Users,
      title: "Verified Teachers",
      description: "All teachers are certified and background-checked",
    },
    {
      icon: BookOpen,
      title: "Learning Materials",
      description: "Access to textbooks, exercises, and resources",
    },
    {
      icon: MessageCircle,
      title: "Teacher Support",
      description: "Message your teacher anytime between lessons",
    },
    {
      icon: Award,
      title: "Progress Tracking",
      description: "Detailed analytics and achievement system",
    },
  ];

  const faqs = [
    {
      question: "How does pricing work?",
      answer:
        "Teachers set their own rates based on experience and qualifications. You can filter by price range to find teachers that fit your budget.",
    },
    {
      question: "Can I cancel or reschedule lessons?",
      answer:
        "Yes! You can reschedule lessons up to 4 hours before the scheduled time at no charge. Cancellations with less notice may incur fees.",
    },
    {
      question: "What if I'm not satisfied with a lesson?",
      answer:
        "We offer a satisfaction guarantee. If you're not happy with your lesson, contact support within 24 hours for a refund or credit.",
    },
    {
      question: "Are there any hidden fees?",
      answer:
        "No hidden fees! You only pay for lessons and any optional packages you choose. No subscription or platform fees.",
    },
    {
      question: "How do payments work?",
      answer:
        "Payments are processed securely through our platform. You can pay with credit card, PayPal, or other supported methods.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge
              variant="outline"
              className="mb-6 bg-primary/10 text-primary border-primary/20"
            >
              Transparent Pricing
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Learn at Prices That
              <span className="text-primary"> Fit Your Budget</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              No subscriptions, no hidden fees. Pay only for the lessons you
              take. Start with a $1 trial lesson to find your perfect teacher.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative overflow-hidden ${
                    plan.popular
                      ? "border-primary shadow-xl scale-105"
                      : "hover:shadow-lg"
                  } transition-all duration-300`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                      {plan.badge}
                    </div>
                  )}
                  {!plan.popular && plan.badge && (
                    <Badge className="absolute top-4 right-4" variant="outline">
                      {plan.badge}
                    </Badge>
                  )}
                  <CardHeader className={plan.popular ? "pt-12" : "pt-8"}>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="flex items-end space-x-2">
                      <span className="text-4xl font-bold text-primary">
                        {plan.price}
                      </span>
                      {plan.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          {plan.originalPrice}
                        </span>
                      )}
                      <span className="text-muted-foreground">
                        {plan.duration}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className={`w-full mb-6 ${plan.popular ? "bg-primary" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                      asChild
                    >
                      <Link to="/teachers">{plan.buttonText}</Link>
                    </Button>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything Included
              </h2>
              <p className="text-lg text-muted-foreground">
                All features are included with every lesson, no matter which
                teacher you choose
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Price Comparison */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Compare With Traditional Learning
              </h2>
              <p className="text-lg text-muted-foreground">
                See how much you save with Talkcon
              </p>
            </div>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
                  <div className="p-8 text-center">
                    <h3 className="text-xl font-semibold mb-4">
                      Language Schools
                    </h3>
                    <div className="text-3xl font-bold text-red-500 mb-2">
                      $200-500
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      per month
                    </p>
                    <ul className="text-sm space-y-2">
                      <li>• Fixed schedule</li>
                      <li>• Group classes</li>
                      <li>• Limited teacher interaction</li>
                      <li>• Travel required</li>
                    </ul>
                  </div>
                  <div className="p-8 text-center bg-primary/5">
                    <h3 className="text-xl font-semibold mb-4">Talkcon</h3>
                    <div className="text-3xl font-bold text-primary mb-2">
                      $60-200
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      per month
                    </p>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        Flexible scheduling
                      </li>
                      <li className="flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        1-on-1 lessons
                      </li>
                      <li className="flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        Personal attention
                      </li>
                      <li className="flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        Learn from home
                      </li>
                    </ul>
                  </div>
                  <div className="p-8 text-center">
                    <h3 className="text-xl font-semibold mb-4">
                      Private Tutors
                    </h3>
                    <div className="text-3xl font-bold text-orange-500 mb-2">
                      $300-800
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      per month
                    </p>
                    <ul className="text-sm space-y-2">
                      <li>• Hard to find</li>
                      <li>• Expensive rates</li>
                      <li>• No verification</li>
                      <li>• Limited availability</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about our pricing
              </p>
            </div>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="p-8 md:p-12 bg-gradient-to-r from-primary to-accent text-white">
              <CardContent className="p-0">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Start Learning?
                </h2>
                <p className="text-lg opacity-90 mb-8">
                  Try your first lesson for just $1 and experience the
                  difference
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-primary"
                    asChild
                  >
                    <Link to="/teachers">
                      <Zap className="mr-2 h-4 w-4" />
                      Book $1 Trial Lesson
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-primary"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Browse Teachers
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
