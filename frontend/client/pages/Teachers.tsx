import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { EnhancedTeacherCard } from "@/components/ui/enhanced-teacher-card";
import { AdvancedSearch } from "@/components/search/AdvancedSearch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CompetitiveSEOHead } from "@/components/seo/CompetitiveSEOHead";
import { AdvancedSchema, FAQItem } from "@/components/seo/AdvancedSchema";
import { SEOMain, SEOH1, SEOH2, SEOSection } from "@/components/seo/SEOLayout";
import {
  Grid,
  List,
  Heart,
  MessageCircle,
  Calendar,
  Zap,
  Filter,
  SortDesc,
  Loader2,
} from "lucide-react";
import { Teacher } from "@shared/api";
import { db } from "@/lib/database";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Footer } from "@/components/ui/footer";
import { toast } from "@/hooks/use-toast";

export default function Teachers() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favoriteTeachers, setFavoriteTeachers] = useState<string[]>([]);

  const [filters, setFilters] = useState({
    search: "",
    language: "All Languages",
    minPrice: 5,
    maxPrice: 100,
    minRating: 0,
    availability: [] as string[],
    country: "All Countries",
    teachingExperience: "",
    isOnline: null as boolean | null,
    hasVideoIntro: false,
    trialAvailable: searchParams.get("trial") === "true",
    specializations: [] as string[],
    certifications: [] as string[],
    responseTime: "",
    sortBy: "rating",
    sortOrder: "desc" as "asc" | "desc",
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [filters, teachers]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      // Get approved teachers from database
      const approvedTeachers = db.getTeachers({ status: "approved" });

      // Add mock data for demo - enhanced teacher profiles
      const enhancedTeachers = approvedTeachers.map((teacher, index) => ({
        ...teacher,
        profileImage: `/placeholder-teacher-${(index % 5) + 1}.jpg`,
        videoIntroUrl:
          index % 3 === 0
            ? "https://www.youtube.com/embed/dQw4w9WgXcQ"
            : undefined,
        certifications:
          index % 2 === 0 ? ["TEFL", "TESOL"] : ["Native Speaker"],
        completedLessons: 50 + index * 10,
        responseTime: index % 3 === 0 ? "within 1 hour" : "within 2 hours",
        isOnline: index % 4 === 0,
        lastActive: new Date(
          Date.now() - Math.random() * 86400000,
        ).toISOString(),
        studentRetentionRate: 80 + Math.floor(Math.random() * 20),
        trialAvailable: index % 3 !== 0,
      }));

      setTeachers(enhancedTeachers);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
      toast({
        title: "Error",
        description: "Failed to load teachers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const searchResults = db.searchTeachers(filters);

    // Sort results
    const sorted = searchResults.sort((a, b) => {
      let aVal, bVal;

      switch (filters.sortBy) {
        case "rating":
          aVal = a.rating;
          bVal = b.rating;
          break;
        case "price":
          aVal = a.hourlyRate;
          bVal = b.hourlyRate;
          break;
        case "experience":
          aVal = a.completedLessons || 0;
          bVal = b.completedLessons || 0;
          break;
        case "popularity":
          aVal = a.completedLessons || 0;
          bVal = b.completedLessons || 0;
          break;
        default:
          aVal = a.rating;
          bVal = b.rating;
      }

      if (filters.sortOrder === "asc") {
        return aVal - bVal;
      } else {
        return bVal - aVal;
      }
    });

    setFilteredTeachers(sorted);
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleFavorite = (teacherId: string) => {
    setFavoriteTeachers((prev) => {
      const newFavorites = prev.includes(teacherId)
        ? prev.filter((id) => id !== teacherId)
        : [...prev, teacherId];

      toast({
        title: prev.includes(teacherId)
          ? "Removed from favorites"
          : "Added to favorites",
        description: prev.includes(teacherId)
          ? "Teacher removed from your favorites"
          : "Teacher added to your favorites",
      });

      return newFavorites;
    });
  };

  const handleMessage = (teacherId: string) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to send messages.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message dialog",
      description: "Message feature will be implemented in the full system.",
    });
  };

  const handleBook = (teacherId: string) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to book lessons.",
        variant: "destructive",
      });
      return;
    }

    // Navigate to teacher profile with booking intent
    window.location.href = `/teacher/${teacherId}?book=true`;
  };

  const handleTrialBook = (teacherId: string) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to book trial lessons.",
        variant: "destructive",
      });
      return;
    }

    // Navigate to trial booking
    window.location.href = `/teacher/${teacherId}?trial=true`;
  };

  // Enhanced FAQ data for teachers page
  const faqData: FAQItem[] = [
    {
      question: "How do I choose the right language teacher?",
      answer:
        "Consider the teacher's qualifications, teaching style, student reviews, and whether they offer trial lessons. Look for teachers who specialize in your learning goals.",
    },
    {
      question: "What is a trial lesson?",
      answer:
        "A trial lesson is a discounted first lesson (usually 30 minutes for $5) that allows you to meet your teacher and see if they're a good fit before committing to regular lessons.",
    },
    {
      question: "How do online language lessons work?",
      answer:
        "Lessons are conducted via video call using our platform. You'll have access to interactive materials, screen sharing, and recording features to enhance your learning experience.",
    },
    {
      question: "Can I switch teachers if I'm not satisfied?",
      answer:
        "Yes, you can try different teachers until you find the perfect match. We recommend booking trial lessons with multiple teachers to compare teaching styles.",
    },
    {
      question: "How much do language lessons cost?",
      answer:
        "Lesson prices vary by teacher experience and qualifications, typically ranging from $10-50 per hour. You can filter teachers by price range to find options within your budget.",
    },
  ];

  return (
    <>
      <CompetitiveSEOHead
        title="Find Your Perfect Language Teacher | Talkcon"
        description="Connect with qualified native language teachers for personalized 1-on-1 lessons. Choose from 1000+ certified instructors teaching 50+ languages. Book your trial lesson today!"
        keywords="language teachers, online tutors, native speakers, language lessons, learn languages online"
        canonicalUrl="/teachers"
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        <SEOMain>
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
              <SEOH1 className="text-4xl md:text-5xl font-bold mb-4">
                {t("teacher.findTeachers")}
              </SEOH1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Connect with qualified native speakers and certified teachers
                for personalized language learning
              </p>
            </div>

            {/* Search and Filters */}
            <AdvancedSearch
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onSearch={handleSearch}
              resultCount={filteredTeachers.length}
              className="mb-8"
            />

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">
                  {filteredTeachers.length} Teachers Found
                </h2>
                {filters.trialAvailable && (
                  <Badge className="bg-green-100 text-green-800">
                    <Zap className="h-3 w-3 mr-1" />
                    Trial Lessons Available
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading teachers...</span>
              </div>
            )}

            {/* Teacher Grid/List */}
            {!loading && (
              <SEOSection>
                {filteredTeachers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-2">
                      No teachers found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters to see more results
                    </p>
                    <Button
                      onClick={() =>
                        handleFiltersChange({
                          ...filters,
                          search: "",
                          language: "All Languages",
                          minPrice: 5,
                          maxPrice: 100,
                          minRating: 0,
                          country: "All Countries",
                          isOnline: null,
                          hasVideoIntro: false,
                          trialAvailable: false,
                          specializations: [],
                          certifications: [],
                        })
                      }
                    >
                      Clear All Filters
                    </Button>
                  </div>
                ) : (
                  <div
                    className={`grid gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-1 max-w-4xl mx-auto"
                    }`}
                  >
                    {filteredTeachers.map((teacher) => (
                      <EnhancedTeacherCard
                        key={teacher.id}
                        teacher={teacher}
                        onFavorite={handleFavorite}
                        onMessage={handleMessage}
                        onBook={handleBook}
                        onTrialBook={handleTrialBook}
                        isFavorite={favoriteTeachers.includes(teacher.id)}
                        showFullInfo={viewMode === "grid"}
                        className={viewMode === "list" ? "flex-row" : ""}
                      />
                    ))}
                  </div>
                )}
              </SEOSection>
            )}

            {/* Call to Action */}
            <SEOSection className="text-center py-12 bg-accent/30 rounded-lg mt-12">
              <SEOH2 className="text-2xl font-bold mb-4">
                Ready to Start Learning?
              </SEOH2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of students who have achieved their language
                goals with our qualified teachers. Book your first trial lesson
                today!
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, trialAvailable: true }))
                  }
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Find Trial Lessons
                </Button>
                <Button size="lg" variant="outline">
                  <Heart className="h-5 w-5 mr-2" />
                  View Favorites
                </Button>
              </div>
            </SEOSection>
          </div>
        </SEOMain>

        {/* FAQ Section */}
        <SEOSection className="bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <SEOH2 className="text-3xl font-bold text-center mb-8">
              Frequently Asked Questions
            </SEOH2>
            <AdvancedSchema faqItems={faqData} />
          </div>
        </SEOSection>

        <Footer />
      </div>
    </>
  );
}
