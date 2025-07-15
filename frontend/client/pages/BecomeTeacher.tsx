import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  DollarSign,
  Clock,
  Globe,
  Users,
  Star,
  TrendingUp,
  GraduationCap,
  Heart,
  CheckCircle,
  ArrowRight,
  Play,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Footer } from "@/components/ui/footer";

export default function BecomeTeacher() {
  const { t } = useLanguage();
  const benefits = [
    {
      icon: DollarSign,
      title: "Earn $10-50 per hour",
      description:
        "Set your own rates and earn competitive income teaching what you love",
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description:
        "Work whenever you want, from anywhere in the world. You control your time",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Teach students from 150+ countries and make a worldwide impact",
    },
    {
      icon: Users,
      title: "Growing Community",
      description:
        "Join 10,000+ teachers in our supportive, professional community",
    },
  ];

  const requirements = [
    "Native or near-native fluency in your teaching language",
    "Teaching experience or relevant certification preferred",
    "Reliable internet connection and quiet teaching space",
    "Passion for helping others learn languages",
    "Professional attitude and communication skills",
  ];

  const steps = [
    {
      number: "1",
      title: "Apply Online",
      description: "Complete our simple application in just 10 minutes",
    },
    {
      number: "2",
      title: "Interview & Demo",
      description: "Show us your teaching skills in a short video interview",
    },
    {
      number: "3",
      title: "Get Approved",
      description: "We'll review your application within 48 hours",
    },
    {
      number: "4",
      title: "Start Teaching",
      description: "Create your profile and start earning immediately",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Active Teachers" },
    { number: "$2M+", label: "Earned Monthly" },
    { number: "4.9/5", label: "Average Rating" },
    { number: "150+", label: "Countries" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge
                  variant="outline"
                  className="mb-6 bg-primary/10 text-primary border-primary/20"
                >
                  Become a Teacher
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Teach Languages,
                  <span className="text-primary"> Change Lives</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Share your language expertise with students worldwide. Earn
                  money, work flexibly, and make a meaningful impact from
                  anywhere.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button size="lg" asChild>
                    <Link to="/signup">
                      Start Teaching Today
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline">
                    <Play className="mr-2 h-4 w-4" />
                    Watch Demo
                  </Button>
                </div>
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    No upfront costs
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Weekly payments
                  </div>
                </div>
              </div>
              <div className="relative">
                <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10">
                  <CardContent className="p-0 text-center">
                    <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <GraduationCap className="w-16 h-16 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Join Our Community
                    </h3>
                    <p className="text-muted-foreground">
                      Over 10,000 teachers trust Talkcon
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Teach with Talkcon?
              </h2>
              <p className="text-lg text-muted-foreground">
                Join the world's most supportive platform for language teachers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card
                  key={index}
                  className="text-center p-6 hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                      <benefit.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Do You Qualify?
              </h2>
              <p className="text-lg text-muted-foreground">
                Most teachers meet our requirements. Check if you're ready to
                start
              </p>
            </div>

            <Card className="p-8">
              <CardContent className="p-0">
                <div className="space-y-4">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        {requirement}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-6 bg-primary/5 rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">
                    Don't meet all requirements?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Don't worry! We provide training and support to help you
                    succeed. Apply anyway and let us help you get started.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Apply Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How to Get Started
              </h2>
              <p className="text-lg text-muted-foreground">
                From application to first lesson in just 3-5 days
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="text-center relative">
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
                  )}
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-primary" />
              </div>
              <blockquote className="text-xl md:text-2xl font-medium mb-6">
                "Teaching on Talkcon has been life-changing. I've helped
                hundreds of students while earning a great income from home."
              </blockquote>
              <div>
                <div className="font-semibold">Sarah Chen</div>
                <div className="text-sm text-muted-foreground">
                  Chinese Teacher • $3,500/month
                </div>
                <div className="flex items-center justify-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 md:p-12 bg-gradient-to-r from-primary to-accent text-white">
              <CardContent className="p-0 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Start Teaching?
                </h2>
                <p className="text-lg opacity-90 mb-8">
                  Join thousands of teachers who are making a difference while
                  earning great income
                </p>
                <div className="space-y-4">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-primary"
                    asChild
                  >
                    <Link to="/signup">
                      Apply to Teach Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <div className="flex items-center justify-center space-x-6 text-sm opacity-80">
                    <div>✓ Free to apply</div>
                    <div>✓ 48-hour approval</div>
                    <div>✓ Weekly payments</div>
                  </div>
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
