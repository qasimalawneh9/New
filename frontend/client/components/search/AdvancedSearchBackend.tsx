import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  X,
  Star,
  Clock,
  DollarSign,
  Globe,
  Video,
  Award,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import { Checkbox } from "../ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Separator } from "../ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  teacherService,
  AdvancedTeacherSearchFilters,
} from "@/api/services/teacher.service";

interface AdvancedSearchBackendProps {
  filters: AdvancedTeacherSearchFilters;
  onFiltersChange: (filters: AdvancedTeacherSearchFilters) => void;
  onSearch: () => void;
  resultCount?: number;
  className?: string;
}

export function AdvancedSearchBackend({
  filters,
  onFiltersChange,
  onSearch,
  resultCount = 0,
  className,
}: AdvancedSearchBackendProps) {
  const { t } = useLanguage();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState<any>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    // Fetch search suggestions when search term changes
    if (filters.search && filters.search.length > 2) {
      fetchSearchSuggestions(filters.search);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [filters.search]);

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

  const fetchSearchSuggestions = async (query: string) => {
    setLoadingSuggestions(true);
    try {
      const response = await teacherService.getSearchSuggestions(query);
      if (response.success && response.data) {
        setSearchSuggestions(response.data);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Failed to fetch search suggestions:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const updateFilter = (
    key: keyof AdvancedTeacherSearchFilters,
    value: any,
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
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

  const activeFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.languages && filters.languages.length > 0) count++;
    if (filters.price_min && filters.price_min > 5) count++;
    if (filters.price_max && filters.price_max < 100) count++;
    if (filters.rating_min && filters.rating_min > 0) count++;
    if (filters.country) count++;
    if (filters.teaching_experience) count++;
    if (filters.is_online !== undefined) count++;
    if (filters.has_video_intro) count++;
    if (filters.has_trial) count++;
    if (filters.specializations && filters.specializations.length > 0) count++;
    if (filters.certifications && filters.certifications.length > 0) count++;
    if (filters.response_time) count++;
    return count;
  };

  const toggleArrayFilter = (
    key: "languages" | "specializations" | "certifications",
    item: string,
  ) => {
    const current = filters[key] || [];
    const updated = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];
    updateFilter(key, updated);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setShowSuggestions(false);
      onSearch();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    updateFilter("search", suggestion);
    setShowSuggestions(false);
    onSearch();
  };

  // Use filter options from API or fallback to defaults
  const languages = filterOptions?.languages || [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Russian",
    "Chinese",
    "Japanese",
    "Korean",
    "Arabic",
    "Hindi",
  ];

  const countries = filterOptions?.countries || [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Spain",
    "France",
    "Germany",
    "Italy",
    "Portugal",
    "Brazil",
    "Mexico",
  ];

  const specializations = filterOptions?.specializations || [
    "Business English",
    "Conversational",
    "Grammar",
    "Pronunciation",
    "IELTS Preparation",
    "TOEFL Preparation",
    "Academic Writing",
    "Interview Preparation",
    "Accent Reduction",
    "Travel Language",
  ];

  const certifications = filterOptions?.certifications || [
    "TEFL",
    "TESOL",
    "CELTA",
    "DELTA",
    "Teaching Degree",
    "Language Degree",
    "Native Speaker",
    "Cambridge Certified",
  ];

  return (
    <div className={className}>
      {/* Search Bar with Suggestions */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search teachers by name, language, or specialization..."
            value={filters.search || ""}
            onChange={(e) => updateFilter("search", e.target.value)}
            onKeyDown={handleSearchKeyDown}
            onFocus={() =>
              filters.search &&
              filters.search.length > 2 &&
              setShowSuggestions(true)
            }
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-10"
          />
          {loadingSuggestions && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}

          {/* Search Suggestions Dropdown */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {searchSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-accent cursor-pointer"
                  onClick={() => selectSuggestion(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <Button onClick={onSearch} className="px-6">
          {t("common.search")}
        </Button>
        <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              {t("common.filter")}
              {activeFiltersCount() > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-2 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {activeFiltersCount()}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Advanced Filters</SheetTitle>
              <SheetDescription>
                Refine your search to find the perfect teacher
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 mt-6">
              {/* Quick Filters */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Quick Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={
                        filters.is_online === true ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        updateFilter(
                          "is_online",
                          filters.is_online === true ? undefined : true,
                        )
                      }
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      Online Now
                    </Button>
                    <Button
                      variant={filters.has_video_intro ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        updateFilter(
                          "has_video_intro",
                          !filters.has_video_intro,
                        )
                      }
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Has Video Intro
                    </Button>
                    <Button
                      variant={filters.has_trial ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        updateFilter("has_trial", !filters.has_trial)
                      }
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Trial Available
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Language & Location */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    <Globe className="h-4 w-4 inline mr-2" />
                    Languages ({filters.languages?.length || 0} selected)
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {languages.map((lang) => (
                      <div key={lang} className="flex items-center space-x-2">
                        <Checkbox
                          id={lang}
                          checked={filters.languages?.includes(lang) || false}
                          onCheckedChange={() =>
                            toggleArrayFilter("languages", lang)
                          }
                        />
                        <label
                          htmlFor={lang}
                          className="text-xs cursor-pointer"
                        >
                          {lang}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Country
                  </label>
                  <Select
                    value={filters.country || ""}
                    onValueChange={(value) => updateFilter("country", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any country</SelectItem>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  <DollarSign className="h-4 w-4 inline mr-2" />
                  Price Range (${filters.price_min || 5} - $
                  {filters.price_max || 100}/hour)
                </label>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">
                      Minimum: ${filters.price_min || 5}
                    </label>
                    <Slider
                      value={[filters.price_min || 5]}
                      onValueChange={(value) =>
                        updateFilter("price_min", value[0])
                      }
                      min={5}
                      max={100}
                      step={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">
                      Maximum: ${filters.price_max || 100}
                    </label>
                    <Slider
                      value={[filters.price_max || 100]}
                      onValueChange={(value) =>
                        updateFilter("price_max", value[0])
                      }
                      min={5}
                      max={100}
                      step={5}
                    />
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  <Star className="h-4 w-4 inline mr-2" />
                  Minimum Rating
                </label>
                <div className="flex gap-2">
                  {[0, 3, 4, 4.5, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant={
                        filters.rating_min === rating ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => updateFilter("rating_min", rating)}
                    >
                      {rating === 0 ? "Any" : `${rating}+`}
                      {rating > 0 && (
                        <Star className="h-3 w-3 ml-1 fill-current" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Teaching Experience */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  <Award className="h-4 w-4 inline mr-2" />
                  Teaching Experience
                </label>
                <Select
                  value={filters.teaching_experience || ""}
                  onValueChange={(value) =>
                    updateFilter("teaching_experience", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any experience level</SelectItem>
                    <SelectItem value="new">New Teacher (0-1 years)</SelectItem>
                    <SelectItem value="experienced">
                      Experienced (2-5 years)
                    </SelectItem>
                    <SelectItem value="expert">Expert (5+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Response Time */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  <Clock className="h-4 w-4 inline mr-2" />
                  Response Time
                </label>
                <Select
                  value={filters.response_time || ""}
                  onValueChange={(value) =>
                    updateFilter("response_time", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any response time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any response time</SelectItem>
                    <SelectItem value="within_1_hour">Within 1 hour</SelectItem>
                    <SelectItem value="within_2_hours">
                      Within 2 hours
                    </SelectItem>
                    <SelectItem value="within_24_hours">
                      Within 24 hours
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Specializations */}
              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
                  Specializations ({filters.specializations?.length || 0}{" "}
                  selected)
                  <Filter className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <div className="grid grid-cols-2 gap-2">
                    {specializations.map((spec) => (
                      <div key={spec} className="flex items-center space-x-2">
                        <Checkbox
                          id={spec}
                          checked={
                            filters.specializations?.includes(spec) || false
                          }
                          onCheckedChange={() =>
                            toggleArrayFilter("specializations", spec)
                          }
                        />
                        <label
                          htmlFor={spec}
                          className="text-xs cursor-pointer"
                        >
                          {spec}
                        </label>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Certifications */}
              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
                  Certifications ({filters.certifications?.length || 0}{" "}
                  selected)
                  <Award className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <div className="grid grid-cols-2 gap-2">
                    {certifications.map((cert) => (
                      <div key={cert} className="flex items-center space-x-2">
                        <Checkbox
                          id={cert}
                          checked={
                            filters.certifications?.includes(cert) || false
                          }
                          onCheckedChange={() =>
                            toggleArrayFilter("certifications", cert)
                          }
                        />
                        <label
                          htmlFor={cert}
                          className="text-xs cursor-pointer"
                        >
                          {cert}
                        </label>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Sort Options */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Sort By
                  </label>
                  <Select
                    value={filters.sort_by || "rating"}
                    onValueChange={(value) => updateFilter("sort_by", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="experience">Experience</SelectItem>
                      <SelectItem value="popularity">Popularity</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Order
                  </label>
                  <Select
                    value={filters.sort_order || "desc"}
                    onValueChange={(value) =>
                      updateFilter("sort_order", value as "asc" | "desc")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">High to Low</SelectItem>
                      <SelectItem value="asc">Low to High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    onSearch();
                    setIsFiltersOpen(false);
                  }}
                  className="flex-1"
                >
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters & Results */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: "{filters.search}"
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter("search", "")}
              />
            </Badge>
          )}
          {filters.languages && filters.languages.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              {filters.languages.length} Language
              {filters.languages.length > 1 ? "s" : ""}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter("languages", [])}
              />
            </Badge>
          )}
          {filters.rating_min && filters.rating_min > 0 && (
            <Badge variant="secondary" className="gap-1">
              {filters.rating_min}+ stars
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter("rating_min", 0)}
              />
            </Badge>
          )}
          {filters.is_online === true && (
            <Badge variant="secondary" className="gap-1">
              Online Now
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter("is_online", undefined)}
              />
            </Badge>
          )}
          {filters.has_trial && (
            <Badge variant="secondary" className="gap-1">
              Trial Available
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter("has_trial", false)}
              />
            </Badge>
          )}
          {activeFiltersCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground"
            >
              Clear all filters
            </Button>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {resultCount} {resultCount === 1 ? "teacher" : "teachers"} found
        </div>
      </div>
    </div>
  );
}

export default AdvancedSearchBackend;
