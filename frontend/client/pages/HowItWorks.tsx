import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { SEOHead, createBreadcrumbSchema } from "@/components/seo/SEOHead";
import {
  SEOMain,
  SEOH1,
  SEOH2,
  SEOH3,
  SEOSection,
} from "@/components/seo/SEOLayout";
import {
  Search,
  Calendar,
  Video,
  Star,
  Users,
  BookOpen,
  MessageCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Footer } from "@/components/ui/footer";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Find Your Perfect Teacher",
      description:
        "Browse through thousands of verified native speakers and certified teachers. Filter by language, price, availability, and teaching style.",
      icon: Search,
      features: [
        "Advanced search filters",
        "Teacher profiles & reviews",
        "Video introductions",
        "Verified credentials",
      ],
    },
    {
      number: "02",
      title: "Book Your Lesson",
      description:
        "Schedule lessons at your convenience. Choose from trial lessons, individual sessions, or lesson packages that fit your budget.",
      icon: Calendar,
      features: [
        "Flexible scheduling",
        "$1 trial lessons",
        "Instant booking",
        "Multiple time zones",
      ],
    },
    {
      number: "03",
      title: "Learn & Practice",
      description:
        "Join your HD video lesson and start speaking from day one. Use interactive tools, share materials, and track your progress.",
      icon: Video,
      features: [
        "HD video calls",
        "Interactive whiteboard",
        "Progress tracking",
        "Lesson recordings",
      ],
    },
    {
      number: "04",
      title: "Track Your Progress",
      description:
        "Monitor your learning journey with detailed analytics, achievement badges, and personalized feedback from your teacher.",
      icon: Star,
      features: [
        "Progress analytics",
        "Achievement system",
        "Personalized feedback",
        "Goal setting",
      ],
    },
  ];

  const benefits = [
    {
      title: "Learn at Your Own Pace",
      description:
        "No rigid schedules or fixed curricula. Learn what you want, when you want, at a pace that works for you.",
      icon: BookOpen,
    },
    {
      title: "Real Conversation Practice",
      description:
        "Practice speaking with native speakers from day one. Build confidence through real conversations.",
      icon: MessageCircle,
    },
    {
      title: "Personalized Learning",
      description:
        "Every lesson is tailored to your goals, interests, and learning style for maximum effectiveness.",
      icon: Users,
    },
  ];

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "https://talkcon.com" },
    { name: "How It Works", url: "https://talkcon.com/how-it-works" },
  ]);

  return (
    <>
      <SEOHead
        title="How It Works - Learn Languages Online in 3 Simple Steps | Talkcon"
        description="Discover how easy it is to learn languages online with Talkcon. Find your perfect teacher, book lessons, and start speaking confidently in 3 simple steps. Trial lessons from $1."
        keywords="how to learn languages online, online language learning process, language tutoring steps, find language teacher, book language lessons, online language classes"
        ogTitle="How Talkcon Works - Start Learning Languages in 3 Simple Steps"
        ogDescription="Learn how easy it is to master any language with Talkcon. Browse certified teachers, book flexible lessons, and practice with native speakers. Get started today!"
        canonical="https://talkcon.com/how-it-works"
        structured={breadcrumbSchema}
      />
      <div className="min-h-screen bg-background">
        <Navbar />

        <SEOMain>
          {/* Hero Section */}
          <SEOSection className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <Badge
                  variant="outline"
                  className="mb-6 bg-primary/10 text-primary border-primary/20"
                >
                  How Talkcon Works
                </Badge>
                <SEOH1 className="text-4xl md:text-6xl font-bold mb-6">
                  Start Speaking a New Language in
                  <span className="text-primary"> 4 Simple Steps</span>
                </SEOH1>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join millions of learners who trust Talkcon to achieve their
                  language goals. Our proven method gets you speaking
                  confidently in weeks, not years.
                </p>
                <Button size="lg" asChild>
                  <Link to="/teachers">
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </SEOSection>

          {/* Steps Section */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Your Journey to Fluency
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    From your first lesson to fluent conversations, we guide you
                    every step of the way
                  </p>
                </div>

                <div className="space-y-16">
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
                    >
                      <div className="flex-1 space-y-6">
                        <div className="flex items-center space-x-4">
                          <div className="text-6xl font-bold text-primary/20">
                            {step.number}
                          </div>
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <step.icon className="h-8 w-8 text-primary" />
                          </div>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold">
                          {step.title}
                        </h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {step.features.map((feature, featureIndex) => (
                            <div
                              key={featureIndex}
                              className="flex items-center space-x-2"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex-1">
                        <Card className="p-8 bg-gradient-to-br from-muted/50 to-muted/20">
                          <CardContent className="p-0">
                            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                              <step.icon className="h-16 w-16 text-muted-foreground" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Why Choose Talkcon?
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Experience the difference that personalized, human-centered
                    learning makes
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {benefits.map((benefit, index) => (
                    <Card key={index} className="text-center p-6">
                      <CardContent className="p-0">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                          <benefit.icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">
                          {benefit.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {benefit.description}
                        </p>
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
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Start Your Language Journey?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Join over 10 million learners who trust Talkcon. Book your
                  first lesson today!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link to="/signup">Start Learning Today</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/teachers">Browse Teachers</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </SEOMain>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
