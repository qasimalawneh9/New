import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { EnhancedTeacherCard } from "@/components/ui/enhanced-teacher-card";
import { AdvancedSearchBackend } from "@/components/search/AdvancedSearchBackend";
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
  Save,
  Bell,
  RefreshCw,
  TrendingUp,
  Star,
  AlertTriangle,
} from "lucide-react";
import { Teacher } from "@shared/api";
import {
  teacherService,
  AdvancedTeacherSearchFilters,
} from "@/api/services/teacher.service";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Footer } from "@/components/ui/footer";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function TeachersAdvanced() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favoriteTeachers, setFavoriteTeachers] = useState<string[]>([]);
  const [onlineStatuses, setOnlineStatuses] = useState<Record<string, boolean>>(
    {},
  );
  const [saveSearchOpen, setSaveSearchOpen] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState("");
  const [searchStats, setSearchStats] = useState<any>(null);
  const [featuredTeachers, setFeaturedTeachers] = useState<Teacher[]>([]);
  const [trendingTeachers, setTrendingTeachers] = useState<Teacher[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<any>(null);

  // Advanced search filters with backend API format
  const [filters, setFilters] = useState<AdvancedTeacherSearchFilters>({
    search: searchParams.get("q") || "",
    languages: searchParams.get("lang") ? [searchParams.get("lang")!] : [],
    price_min: Number(searchParams.get("price_min")) || 5,
    price_max: Number(searchParams.get("price_max")) || 100,
    rating_min: Number(searchParams.get("rating_min")) || 0,
    country: searchParams.get("country") || "",
    teaching_experience: searchParams.get("experience") || "",
    is_online: searchParams.get("online") === "true" ? true : undefined,
    has_video_intro: searchParams.get("video") === "true",
    has_trial: searchParams.get("trial") === "true",
    specializations: searchParams.get("spec")
      ? searchParams.get("spec")!.split(",")
      : [],
    certifications: searchParams.get("cert")
      ? searchParams.get("cert")!.split(",")
      : [],
    response_time: searchParams.get("response") || "",
    sort_by: (searchParams.get("sort") as any) || "rating",
    sort_order: (searchParams.get("order") as "asc" | "desc") || "desc",
    page: Number(searchParams.get("page")) || 1,
    per_page: 24,
  });

  useEffect(() => {
    initializePage();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [filters]);

  useEffect(() => {
    // Update URL params when filters change
    updateURLParams();
  }, [filters]);

  useEffect(() => {
    if (user) {
      fetchUserFavorites();
    }
  }, [user]);

  const initializePage = async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchFilterOptions(),
        fetchSearchStats(),
        fetchFeaturedTeachers(),
        fetchTrendingTeachers(),
      ]);

      await handleSearch();
    } catch (error) {
      console.error("Failed to initialize page:", error);
      setError("Failed to load page data. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const response = await teacherService.getFilterOptions();
      if (response.success && response.data) {
        setFilterOptions(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch filter options:", error);
    }
  };

  const fetchSearchStats = async () => {
    try {
      const response = await teacherService.getStats();
      if (response.success && response.data) {
        setSearchStats(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch search stats:", error);
    }
  };

  const fetchFeaturedTeachers = async () => {
    try {
      const response = await teacherService.getFeatured(6);
      if (response.success && response.data) {
        setFeaturedTeachers(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch featured teachers:", error);
    }
  };

  const fetchTrendingTeachers = async () => {
    try {
      const response = await teacherService.getTrending(6);
      if (response.success && response.data) {
        setTrendingTeachers(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch trending teachers:", error);
    }
  };

  const fetchUserFavorites = async () => {
    if (!user) return;

    try {
      const response = await teacherService.getFavorites();
      if (response.success && response.data) {
        setFavoriteTeachers(response.data.map((teacher: any) => teacher.id));
      }
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    }
  };

  const handleSearch = useCallback(async () => {
    setSearchLoading(true);
    setError(null);

    try {
      const response = await teacherService.search(filters);
      if (response.success && response.data) {
        setTeachers(response.data);

        // Fetch online statuses for all teachers
        const teacherIds = response.data.map((teacher: any) => teacher.id);
        if (teacherIds.length > 0) {
          try {
            const statusResponse =
              await teacherService.getBulkOnlineStatus(teacherIds);
            if (statusResponse.success && statusResponse.data) {
              setOnlineStatuses(statusResponse.data);
            }
          } catch (statusError) {
            console.error("Failed to fetch online statuses:", statusError);
          }
        }
      } else {
        throw new Error(response.message || "Failed to search teachers");
      }
    } catch (error) {
      console.error("Failed to search teachers:", error);
      setError("Failed to search teachers. Please try again.");
      setTeachers([]);
    } finally {
      setSearchLoading(false);
    }
  }, [filters]);

  const updateURLParams = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value) && value.length > 0) {
          const paramKey =
            key === "languages"
              ? "lang"
              : key === "specializations"
                ? "spec"
                : key === "certifications"
                  ? "cert"
                  : key;
          params.set(paramKey, value.join(","));
        } else if (typeof value === "string" || typeof value === "number") {
          params.set(key, value.toString());
        } else if (typeof value === "boolean") {
          params.set(key, value.toString());
        }
      }
    });
    setSearchParams(params);
  };

  const handleFiltersChange = (newFilters: AdvancedTeacherSearchFilters) => {
    setFilters({ ...newFilters, page: 1 }); // Reset page when filters change
  };

  const handleFavorite = async (teacherId: string) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to save favorites.",
        variant: "destructive",
      });
      return;
    }

    try {
      const isFavorite = favoriteTeachers.includes(teacherId);

      if (isFavorite) {
        await teacherService.removeFromFavorites(teacherId);
        setFavoriteTeachers((prev) => prev.filter((id) => id !== teacherId));
        toast({
          title: "Removed from favorites",
          description: "Teacher removed from your favorites",
        });
      } else {
        await teacherService.addToFavorites(teacherId);
        setFavoriteTeachers((prev) => [...prev, teacherId]);
        toast({
          title: "Added to favorites",
          description: "Teacher added to your favorites",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
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

    // Navigate to messaging system
    window.location.href = `/messages?teacher=${teacherId}`;
  };

  const handleBook = async (teacherId: string) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to book lessons.",
        variant: "destructive",
      });
      return;
    }

    // Track teacher view
    try {
      await teacherService.trackView(teacherId);
    } catch (error) {
      console.error("Failed to track view:", error);
    }

    // Navigate to teacher profile with booking intent
    window.location.href = `/teacher/${teacherId}?book=true`;
  };

  const handleTrialBook = async (teacherId: string) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to book trial lessons.",
        variant: "destructive",
      });
      return;
    }

    // Track teacher view
    try {
      await teacherService.trackView(teacherId);
    } catch (error) {
      console.error("Failed to track view:", error);
    }

    // Navigate to trial booking
    window.location.href = `/teacher/${teacherId}?trial=true`;
  };

  const handleSaveSearch = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to save searches.",
        variant: "destructive",
      });
      return;
    }

    if (!saveSearchName.trim()) {
      toast({
        title: "Enter search name",
        description: "Please enter a name for your saved search.",
        variant: "destructive",
      });
      return;
    }

    try {
      await teacherService.saveSearch(saveSearchName, filters);
      toast({
        title: "Search saved",
        description: "Your search has been saved successfully.",
      });
      setSaveSearchOpen(false);
      setSaveSearchName("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save search. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    handleSearch();
    fetchSearchStats();
  };

  const clearAllFilters = () => {
    handleFiltersChange({
      search: "",
      languages: [],
      price_min: 5,
      price_max: 100,
      rating_min: 0,
      country: "",
      teaching_experience: "",
      is_online: undefined,
      has_video_intro: false,
      has_trial: false,
      specializations: [],
      certifications: [],
      response_time: "",
      sort_by: "rating",
      sort_order: "desc",
      page: 1,
      per_page: 24,
    });
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

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Search and Filters */}
            <AdvancedSearchBackend
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onSearch={handleSearch}
              resultCount={teachers.length}
              className="mb-8"
            />

            {/* Search Statistics */}
            {searchStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{teachers.length}</div>
                    <div className="text-sm text-muted-foreground">
                      Teachers Found
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {Object.values(onlineStatuses).filter(Boolean).length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Online Now
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">
                      {searchStats.average_rating?.toFixed(1) || "4.8"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg. Rating
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">
                      {searchStats.languages_available?.length || "50+"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Languages
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">
                  {teachers.length} Teachers Found
                </h2>
                {filters.has_trial && (
                  <Badge className="bg-green-100 text-green-800">
                    <Zap className="h-3 w-3 mr-1" />
                    Trial Lessons Available
                  </Badge>
                )}
                {filters.is_online && (
                  <Badge className="bg-blue-100 text-blue-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                    Online Now
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={searchLoading}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${searchLoading ? "animate-spin" : ""}`}
                  />
                </Button>

                {user && (
                  <Dialog
                    open={saveSearchOpen}
                    onOpenChange={setSaveSearchOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Save className="h-4 w-4 mr-1" />
                        Save Search
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Search</DialogTitle>
                        <DialogDescription>
                          Save this search to easily find similar teachers in
                          the future.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Input
                          placeholder="Enter search name"
                          value={saveSearchName}
                          onChange={(e) => setSaveSearchName(e.target.value)}
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setSaveSearchOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSaveSearch}>Save Search</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

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
            {(loading || searchLoading) && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">
                  {loading ? "Loading teachers..." : "Searching..."}
                </span>
              </div>
            )}

            {/* Featured Teachers - Show when no search applied */}
            {!loading &&
              !searchLoading &&
              teachers.length === 0 &&
              featuredTeachers.length > 0 && (
                <SEOSection className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <h3 className="text-lg font-semibold">Featured Teachers</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredTeachers.slice(0, 6).map((teacher) => (
                      <EnhancedTeacherCard
                        key={teacher.id}
                        teacher={teacher}
                        onFavorite={handleFavorite}
                        onMessage={handleMessage}
                        onBook={handleBook}
                        onTrialBook={handleTrialBook}
                        isFavorite={favoriteTeachers.includes(teacher.id)}
                        showFullInfo={true}
                      />
                    ))}
                  </div>
                </SEOSection>
              )}

            {/* Trending Teachers */}
            {!loading &&
              !searchLoading &&
              teachers.length === 0 &&
              trendingTeachers.length > 0 && (
                <SEOSection className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-semibold">Trending Teachers</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trendingTeachers.slice(0, 6).map((teacher) => (
                      <EnhancedTeacherCard
                        key={teacher.id}
                        teacher={teacher}
                        onFavorite={handleFavorite}
                        onMessage={handleMessage}
                        onBook={handleBook}
                        onTrialBook={handleTrialBook}
                        isFavorite={favoriteTeachers.includes(teacher.id)}
                        showFullInfo={true}
                      />
                    ))}
                  </div>
                </SEOSection>
              )}

            {/* Teacher Grid/List */}
            {!loading && !searchLoading && (
              <SEOSection>
                {teachers.length === 0 && featuredTeachers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-2">
                      No teachers found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters to see more results
                    </p>
                    <Button onClick={clearAllFilters}>Clear All Filters</Button>
                  </div>
                ) : teachers.length > 0 ? (
                  <div
                    className={`grid gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-1 max-w-4xl mx-auto"
                    }`}
                  >
                    {teachers.map((teacher) => (
                      <EnhancedTeacherCard
                        key={teacher.id}
                        teacher={{
                          ...teacher,
                          isOnline: onlineStatuses[teacher.id] || false,
                        }}
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
                ) : null}
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
                    setFilters((prev) => ({ ...prev, has_trial: true }))
                  }
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Find Trial Lessons
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => (window.location.href = "/favorites")}
                >
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
