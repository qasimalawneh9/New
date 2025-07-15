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

interface SearchFilters {
  search: string;
  language: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  availability: string[];
  country: string;
  teachingExperience: string;
  isOnline: boolean | null;
  hasVideoIntro: boolean;
  trialAvailable: boolean;
  specializations: string[];
  certifications: string[];
  responseTime: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface AdvancedSearchProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  resultCount?: number;
  className?: string;
}

const languages = [
  "All Languages",
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
  "Dutch",
  "Swedish",
  "Norwegian",
  "Danish",
  "Finnish",
];

const countries = [
  "All Countries",
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
  "Russia",
  "China",
  "Japan",
  "South Korea",
  "India",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Saudi Arabia",
  "UAE",
];

const specializations = [
  "Business English",
  "Conversational",
  "Grammar",
  "Pronunciation",
  "IELTS Preparation",
  "TOEFL Preparation",
  "Academic Writing",
  "Interview Preparation",
  "Accent Reduction",
  "Literature",
  "Travel Language",
  "Medical Terminology",
  "Legal Language",
  "Technical Language",
  "Children's Language",
  "Exam Preparation",
];

const certifications = [
  "TEFL",
  "TESOL",
  "CELTA",
  "DELTA",
  "Teaching Degree",
  "Language Degree",
  "Native Speaker",
  "Cambridge Certified",
];

export function AdvancedSearch({
  filters,
  onFiltersChange,
  onSearch,
  resultCount = 0,
  className,
}: AdvancedSearchProps) {
  const { t } = useLanguage();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      language: "All Languages",
      minPrice: 5,
      maxPrice: 100,
      minRating: 0,
      availability: [],
      country: "All Countries",
      teachingExperience: "",
      isOnline: null,
      hasVideoIntro: false,
      trialAvailable: false,
      specializations: [],
      certifications: [],
      responseTime: "",
      sortBy: "rating",
      sortOrder: "desc",
    });
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.language !== "All Languages") count++;
    if (filters.minPrice > 5 || filters.maxPrice < 100) count++;
    if (filters.minRating > 0) count++;
    if (filters.country !== "All Countries") count++;
    if (filters.teachingExperience) count++;
    if (filters.isOnline !== null) count++;
    if (filters.hasVideoIntro) count++;
    if (filters.trialAvailable) count++;
    if (filters.specializations.length > 0) count++;
    if (filters.certifications.length > 0) count++;
    if (filters.responseTime) count++;
    return count;
  };

  const toggleSpecialization = (spec: string) => {
    const current = filters.specializations;
    const updated = current.includes(spec)
      ? current.filter((s) => s !== spec)
      : [...current, spec];
    updateFilter("specializations", updated);
  };

  const toggleCertification = (cert: string) => {
    const current = filters.certifications;
    const updated = current.includes(cert)
      ? current.filter((c) => c !== cert)
      : [...current, cert];
    updateFilter("certifications", updated);
  };

  return (
    <div className={className}>
      {/* Search Bar */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t("teacher.findTeachers")}
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10"
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
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
                        filters.isOnline === true ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        updateFilter(
                          "isOnline",
                          filters.isOnline === true ? null : true,
                        )
                      }
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      Online Now
                    </Button>
                    <Button
                      variant={filters.hasVideoIntro ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        updateFilter("hasVideoIntro", !filters.hasVideoIntro)
                      }
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Has Video Intro
                    </Button>
                    <Button
                      variant={filters.trialAvailable ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        updateFilter("trialAvailable", !filters.trialAvailable)
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
                    Language
                  </label>
                  <Select
                    value={filters.language}
                    onValueChange={(value) => updateFilter("language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Country
                  </label>
                  <Select
                    value={filters.country}
                    onValueChange={(value) => updateFilter("country", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                  Price Range (${filters.minPrice} - ${filters.maxPrice}/hour)
                </label>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">
                      Minimum: ${filters.minPrice}
                    </label>
                    <Slider
                      value={[filters.minPrice]}
                      onValueChange={(value) =>
                        updateFilter("minPrice", value[0])
                      }
                      min={5}
                      max={100}
                      step={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">
                      Maximum: ${filters.maxPrice}
                    </label>
                    <Slider
                      value={[filters.maxPrice]}
                      onValueChange={(value) =>
                        updateFilter("maxPrice", value[0])
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
                        filters.minRating === rating ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => updateFilter("minRating", rating)}
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
                  value={filters.teachingExperience}
                  onValueChange={(value) =>
                    updateFilter("teachingExperience", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any experience level</SelectItem>
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
                  value={filters.responseTime}
                  onValueChange={(value) => updateFilter("responseTime", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any response time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any response time</SelectItem>
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
                  Specializations ({filters.specializations.length} selected)
                  <Filter className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <div className="grid grid-cols-2 gap-2">
                    {specializations.map((spec) => (
                      <div key={spec} className="flex items-center space-x-2">
                        <Checkbox
                          id={spec}
                          checked={filters.specializations.includes(spec)}
                          onCheckedChange={() => toggleSpecialization(spec)}
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
                  Certifications ({filters.certifications.length} selected)
                  <Award className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <div className="grid grid-cols-2 gap-2">
                    {certifications.map((cert) => (
                      <div key={cert} className="flex items-center space-x-2">
                        <Checkbox
                          id={cert}
                          checked={filters.certifications.includes(cert)}
                          onCheckedChange={() => toggleCertification(cert)}
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
                    value={filters.sortBy}
                    onValueChange={(value) => updateFilter("sortBy", value)}
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
                    value={filters.sortOrder}
                    onValueChange={(value) =>
                      updateFilter("sortOrder", value as "asc" | "desc")
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
          {filters.language !== "All Languages" && (
            <Badge variant="secondary" className="gap-1">
              {filters.language}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter("language", "All Languages")}
              />
            </Badge>
          )}
          {filters.minRating > 0 && (
            <Badge variant="secondary" className="gap-1">
              {filters.minRating}+ stars
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter("minRating", 0)}
              />
            </Badge>
          )}
          {filters.isOnline === true && (
            <Badge variant="secondary" className="gap-1">
              Online Now
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter("isOnline", null)}
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

export default AdvancedSearch;
