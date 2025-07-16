import { Button } from "./button";
import { Card, CardContent } from "./card";
import {
  Video,
  Calendar,
  MessageCircle,
  Star,
  Clock,
  BookOpen,
  Users,
  Award,
  Headphones,
  Globe,
  TrendingUp,
  Shield,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const features = [
  {
    icon: Video,
    title: "HD Video Lessons",
    description:
      "Crystal-clear video calls with screen sharing and interactive whiteboard for immersive learning experience.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description:
      "Book lessons at your convenience with 24/7 availability across all time zones.",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: MessageCircle,
    title: "Instant Messaging",
    description:
      "Chat with teachers anytime, get homework help, and stay connected between lessons.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Star,
    title: "Verified Teachers",
    description:
      "All teachers are certified natives with teaching credentials and years of experience.",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "Monitor your learning journey with detailed analytics and achievement badges.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    icon: BookOpen,
    title: "Custom Materials",
    description:
      "Access personalized lesson materials, exercises, and resources tailored to your level.",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
];

const benefits = [
  {
    icon: Clock,
    title: "Save 50% of your time",
    description: "Learn 3x faster with personalized 1-on-1 attention",
  },
  {
    icon: Users,
    title: "10,000+ Expert Teachers",
    description: "Choose from the world's largest network of language tutors",
  },
  {
    icon: Award,
    title: "Proven Results",
    description: "95% of students achieve fluency within 6 months",
  },
  {
    icon: Shield,
    title: "Money-back Guarantee",
    description: "Not satisfied? Get a full refund within 30 days",
  },
];

export function FeatureSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Features Grid */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to
            <span className="text-primary"> master any language</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform combines the best of technology and human expertise to
            give you the ultimate language learning experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md"
            >
              <CardContent className="p-6">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.bgColor} ${feature.color} mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              {t("feature.whyChoose")}
            </h3>
            <p className="text-muted-foreground">
              Join millions of learners who trust us with their language journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4">
                  <benefit.icon className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-semibold mb-2">{benefit.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Learning Today
            </Button>
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-20">
          <div className="text-center mb-16">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              How it works
            </h3>
            <p className="text-muted-foreground">
              Start speaking a new language in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Choose Your Teacher",
                description:
                  "Browse our verified teachers, read reviews, and pick the perfect match for your learning style.",
                icon: Users,
              },
              {
                step: "02",
                title: "Book a Lesson",
                description:
                  "Schedule your first lesson at a time that works for you. Start with a trial lesson for just $1.",
                icon: Calendar,
              },
              {
                step: "03",
                title: "Start Learning",
                description:
                  "Join your video lesson and start speaking from day one with personalized curriculum.",
                icon: Headphones,
              },
            ].map((step, index) => (
              <div key={index} className="text-center relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
                )}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                  <step.icon className="w-8 h-8" />
                </div>
                <div className="text-4xl font-bold text-primary/20 mb-2">
                  {step.step}
                </div>
                <h4 className="text-xl font-semibold mb-3">{step.title}</h4>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
