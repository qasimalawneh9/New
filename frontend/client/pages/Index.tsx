import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { HeroSection } from "@/components/ui/hero-section";
import { FeatureSection } from "@/components/ui/feature-section";
import { TeacherCard } from "@/components/ui/teacher-card";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  ArrowRight,
  CheckCircle,
  Quote,
  Globe,
  MessageCircle,
  Video,
} from "lucide-react";
import { Teacher } from "@shared/api";
import { db } from "@/lib/database";
import { useLanguage } from "@/contexts/LanguageContext";
import { CompetitiveSEOHead } from "@/components/seo/CompetitiveSEOHead";
import {
  AdvancedSchema,
  FAQItem,
  ReviewItem,
} from "@/components/seo/AdvancedSchema";
import {
  SEOMain,
  SEOH1,
  SEOH2,
  SEOH3,
  SEOSection,
  SEOImage,
} from "@/components/seo/SEOLayout";
import {
  createWebsiteSchema,
  createOrganizationSchema,
} from "@/components/seo/SEOHead";

const testimonials = [
  {
    name: "Sarah Johnson",
    avatar: "/placeholder.svg",
    rating: 5,
    text: "I went from zero Spanish to conversational in just 6 months! Maria is an amazing teacher who made every lesson engaging and fun.",
    language: "Spanish",
  },
  {
    name: "Ahmed Al-Rashid",
    avatar: "/placeholder.svg",
    rating: 5,
    text: "تعلمت اللغة العربية بطريقة رائعة مع أساتذة ممتازين. الآن يمكنني التحدث بثقة مع زملائي في العمل.",
    language: "Arabic",
    isRtl: true,
  },
  {
    name: "Sarah Johnson",
    avatar: "/placeholder.svg",
    rating: 5,
    text: "I went from zero Spanish to conversational in just 6 months! Maria is an amazing teacher who made every lesson engaging and fun.",
    language: "Spanish",
    flag: "🇪🇸",
  },
  {
    name: "David Chen",
    avatar: "/placeholder.svg",
    rating: 5,
    text: "The flexibility of scheduling and quality of certified language instructors is unmatched. I can finally speak confident English in business meetings. The trial lesson for $1 convinced me this is the best language learning platform.",
    language: "English",
    flag: "🇺🇸",
  },
  {
    name: "Emma Thompson",
    avatar: "/placeholder.svg",
    rating: 5,
    text: "Learning French with native speaker teachers has never been this enjoyable. The interactive personalized language lessons and cultural insights make all the difference. 24/7 availability means I can practice whenever I want.",
    language: "French",
    flag: "🇫🇷",
  },
];

// FAQ data for rich snippets and featured snippets
const faqs: FAQItem[] = [
  {
    question: "How do I find the best online language tutor for my needs?",
    answer:
      "Use our advanced search filters to find certified language instructors by language, price, availability, and teaching style. You can browse native speaker teachers, read reviews, and watch introduction videos. Start with a $1 trial lesson to test compatibility before committing to regular sessions.",
  },
  {
    question:
      "What makes Talkcon different from other language learning platforms?",
    answer:
      "Talkcon offers personalized language lessons with verified native speaker teachers available 24/7. We provide trial lessons from just $1, money-back guarantee, conversation practice sessions, and cultural immersion experiences. Our platform focuses on speaking fluency through real-world practice with authentic native speakers.",
  },
  {
    question: "How much do online language lessons cost?",
    answer:
      "Our language tutors offer competitive rates starting from $1 for trial lessons. Regular personalized language lessons typically range from $10-50 per hour depending on the teacher's experience and specialization. We offer lesson packages for better value and flexible payment options.",
  },
  {
    question: "Can I practice conversation with native speaker teachers?",
    answer:
      "Yes! We specialize in conversation practice online with verified native speakers. Our teachers provide authentic pronunciation training, cultural insights, and real-world communication skills. You can book dedicated conversation practice sessions or include speaking practice in your regular lessons.",
  },
  {
    question: "What languages can I learn on Talkcon?",
    answer:
      "We offer 50+ languages including English, Spanish, French, German, Italian, Portuguese, Chinese (Mandarin), Japanese, Korean, Arabic, Russian, Dutch, and many more. Each language has certified instructors and native speaker teachers available for personalized lessons and conversation practice.",
  },
];

// Review data for schema markup
const reviews: ReviewItem[] = testimonials.map((t) => ({
  author: t.name,
  rating: t.rating,
  reviewBody: t.text,
  datePublished: new Date().toISOString(),
  language: t.language.toLowerCase(),
}));

export default function Index() {
  const { t } = useLanguage();
  const [featuredTeachers, setFeaturedTeachers] = useState<Teacher[]>([]);
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedTeachers();
  }, []);

  useEffect(() => {
    // Filter teachers when language selection changes
    filterTeachersByLanguage(selectedLanguage);
  }, [selectedLanguage, allTeachers]);

  const fetchFeaturedTeachers = async () => {
    try {
      // Get approved teachers from database
      const approvedTeachers = db.getTeachers();
      console.log(
        "Approved teachers loaded for homepage:",
        approvedTeachers.length,
      );

      // Log teacher details to verify application data is present
      approvedTeachers.forEach((teacher) => {
        console.log(
          `Teacher: ${teacher.name}, Languages: ${teacher.languages.join(", ")}, Price: $${teacher.price}, Specialties: ${teacher.specialties.join(", ")}`,
        );
      });

      // Sort by rating
      const sortedTeachers = approvedTeachers.sort(
        (a, b) => b.rating - a.rating,
      );

      setAllTeachers(sortedTeachers);
      // Initially show English teachers
      filterTeachersByLanguage("English", sortedTeachers);
    } catch (error) {
      console.error("Error fetching featured teachers:", error);
      setFeaturedTeachers([]);
      setAllTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterTeachersByLanguage = (
    language: string,
    teachers = allTeachers,
  ) => {
    // Filter teachers by the language they teach
    const filtered = teachers
      .filter((teacher) =>
        teacher.languages.some(
          (lang) =>
            lang.toLowerCase().includes(language.toLowerCase()) ||
            teacher.nativeLanguage.toLowerCase() === language.toLowerCase(),
        ),
      )
      .slice(0, 6); // Show max 6 teachers

    setFeaturedTeachers(filtered);
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      createWebsiteSchema(),
      createOrganizationSchema(),
      {
        "@type": "Service",
        name: "Online Language Tutoring",
        provider: {
          "@type": "Organization",
          name: "Talkcon",
        },
        serviceType: "Language Learning",
        description:
          "Personalized online language lessons with certified native speakers and expert tutors",
        areaServed: "Worldwide",
        availableLanguage: [
          "English",
          "Spanish",
          "French",
          "German",
          "Italian",
          "Portuguese",
          "Chinese",
          "Japanese",
          "Korean",
          "Arabic",
          "Russian",
          "Dutch",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Language Learning Courses",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Course",
                name: "Conversational Practice",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Course",
                name: "Grammar & Writing",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Course",
                name: "Business Language",
              },
            },
          ],
        },
      },
    ],
  };

  return (
    <>
      <CompetitiveSEOHead
        title="Best Online Language Tutors & Native Speaker Teachers | Learn 50+ Languages | Talkcon"
        description="Find the best online language tutors and native speaker teachers. Personalized language lessons from $1 trial. Learn English, Spanish, French, Chinese and 47+ languages with certified instructors. 24/7 availability, money-back guarantee."
        keywords="online language tutor, native speaker language teacher, best language learning platform, personalized language lessons, conversation practice online, language learning marketplace, certified language instructors, trial language lesson online"
        targetKeywords={[
          "online language tutor",
          "native speaker language teacher",
          "best language learning platform",
          "conversation practice online",
        ]}
        competitorKeywords={[
          "online language tutor",
          "personalized language lessons",
          "native speaker teacher",
        ]}
        semanticKeywords={[
          "language acquisition",
          "second language learning",
          "multilingual education",
          "virtual lessons",
          "speaking practice",
          "cultural immersion",
        ]}
        ogTitle="Best Online Language Tutors & Native Speakers | Trial Lessons $1 | Talkcon"
        ogDescription="Connect with 5000+ verified native speaker teachers for personalized language lessons. Trial lessons from just $1. Learn any language with expert tutors available 24/7."
        ogImage="/og-homepage-competitive.jpg"
        ogImageAlt="Online language tutors and native speaker teachers on Talkcon platform"
        twitterTitle="Learn Languages with Native Speaker Tutors | $1 Trial Lessons"
        twitterDescription="5000+ certified language teachers available 24/7. Native speakers, personalized lessons, conversation practice. Start learning any language today!"
        structured={structuredData}
        canonical="https://talkcon.com"
        emphasizeUSPs={true}
        targetCompetitorKeywords={true}
      />
      <AdvancedSchema
        faqs={faqs}
        reviews={reviews}
        includeOrganization={true}
        includeService={true}
      />
      <div className="min-h-screen bg-background">
        <Navbar />

        <SEOMain>
          {/* Hero Section */}
          <HeroSection
            selectedTeacherLanguage={selectedLanguage}
            onLanguageSelect={handleLanguageSelect}
          />

          {/* Featured Teachers */}
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <Badge
                  variant="outline"
                  className="mb-4 bg-primary/10 text-primary border-primary/20"
                >
                  {selectedLanguage} Teachers
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Learn <span className="text-primary">{selectedLanguage}</span>{" "}
                  with expert teachers
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {featuredTeachers.length > 0
                    ? `Showing ${featuredTeachers.length} certified ${selectedLanguage} teachers with excellent reviews.`
                    : `No ${selectedLanguage} teachers available at the moment. Try selecting a different language.`}
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {[...Array(3)].map((_, index) => (
                    <Card key={index} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-64 bg-muted rounded" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {featuredTeachers.map((teacher) => (
                    <TeacherCard key={teacher.id} teacher={teacher} />
                  ))}
                </div>
              )}

              <div className="text-center">
                <Button size="lg" variant="outline" asChild>
                  <Link
                    to={`/teachers?language=${selectedLanguage.toLowerCase()}`}
                  >
                    View All {selectedLanguage} Teachers
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <FeatureSection />

          {/* Testimonials */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  What our students say
                </h2>
                <p className="text-lg text-muted-foreground">
                  Join thousands of happy learners from around the world
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="relative">
                    <CardContent className="p-6">
                      <Quote className="w-8 h-8 text-primary/20 mb-4" />
                      <div className="flex items-center mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        "{testimonial.text}"
                      </p>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={testimonial.avatar}
                            alt={testimonial.name}
                          />
                          <AvatarFallback>
                            {testimonial.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">
                            {testimonial.name}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <span className="mr-1">{testimonial.flag}</span>
                            Learning {testimonial.language}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Ready to start your
                  <br />
                  <span className="text-primary">language journey?</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join over 10 million learners and start speaking a new
                  language today. First lesson is just $1!
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                  <Button size="lg" className="px-8" asChild>
                    <Link to="/teachers">
                      <Globe className="w-4 h-4 mr-2" />
                      Find Your Teacher
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline">
                    <Video className="w-4 h-4 mr-2" />
                    Try Free Lesson
                  </Button>
                </div>

                <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    No subscription required
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Pay per lesson
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Money-back guarantee
                  </div>
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
