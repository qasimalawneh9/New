import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Search, Globe } from "lucide-react";
import { Badge } from "./badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroSectionProps {
  selectedTeacherLanguage?: string;
  onLanguageSelect?: (language: string) => void;
}

const languages = [
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
];

export function HeroSection({
  selectedTeacherLanguage = "English",
  onLanguageSelect,
}: HeroSectionProps) {
  const { t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge
            variant="outline"
            className="mb-6 bg-primary/10 text-primary border-primary/20"
          >
            <Globe className="w-3 h-3 mr-1" />
            Learn any language, anywhere
          </Badge>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            {t("hero.title")}
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            {t("hero.subtitle")}
          </p>

          {/* Search Form */}
          <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-6 mb-12 border shadow-lg max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choose a language to learn" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language} value={language.toLowerCase()}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button size="lg" className="h-12 px-8 gap-2">
                <Search className="w-4 h-4" />
                {t("hero.cta")}
              </Button>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
              <span>Popular:</span>
              {["English", "Spanish", "French", "German"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang.toLowerCase())}
                  className="hover:text-primary transition-colors underline"
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Language Tabs for Teacher Filtering */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">
                Find Teachers by Language
              </h3>
              <p className="text-muted-foreground">
                Browse our expert teachers by the language you want to learn
              </p>
            </div>

            <div className="flex justify-center">
              <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-2 border shadow-lg max-w-full">
                <div
                  className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-1"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {[
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
                  ].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => onLanguageSelect?.(lang)}
                      className={`
                        px-4 py-2 md:px-6 md:py-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap
                        touch-manipulation select-none active:scale-95
                        ${
                          selectedTeacherLanguage === lang
                            ? "bg-primary text-primary-foreground shadow-md scale-105"
                            : "hover:bg-primary/10 text-muted-foreground hover:text-foreground hover:scale-105"
                        }
                      `}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-lg">
                          {lang === "English" && "🇺🇸"}
                          {lang === "Spanish" && "🇪🇸"}
                          {lang === "French" && "🇫🇷"}
                          {lang === "German" && "🇩🇪"}
                          {lang === "Italian" && "🇮🇹"}
                          {lang === "Portuguese" && "🇧🇷"}
                          {lang === "Chinese" && "🇨🇳"}
                          {lang === "Japanese" && "🇯🇵"}
                          {lang === "Korean" && "🇰🇷"}
                          {lang === "Arabic" && "🇸🇦"}
                        </span>
                        <span className="hidden sm:inline">{lang}</span>
                        <span className="sm:hidden text-xs">
                          {lang.slice(0, 3)}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scroll hint for mobile */}
            <div className="text-center mt-2 md:hidden">
              <p className="text-xs text-muted-foreground">
                ← Swipe to see more languages →
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
