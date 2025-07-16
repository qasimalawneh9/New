import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Users,
  Star,
  TrendingUp,
  Globe,
  BookOpen,
  MessageCircle,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Footer } from "@/components/ui/footer";

const languages = [
  {
    name: "English",
    flag: "🇺🇸",
    students: "2.5M+",
    teachers: "1,200+",
    rating: 4.9,
    difficulty: "Easy",
    description:
      "The global lingua franca. Perfect for business, travel, and international communication.",
    popular: true,
    trending: true,
  },
  {
    name: "Spanish",
    flag: "🇪🇸",
    students: "1.8M+",
    teachers: "950+",
    rating: 4.8,
    difficulty: "Easy",
    description:
      "Spoken by 500M+ people worldwide. Great for career advancement and cultural exploration.",
    popular: true,
    trending: true,
  },
  {
    name: "Arabic",
    flag: "🇸🇦",
    students: "800K+",
    teachers: "420+",
    rating: 4.7,
    difficulty: "Challenging",
    description:
      "الآراب و الاوالة. Spoken by 400M+ people. Essential for business in the Middle East and religious studies.",
    popular: true,
    trending: true,
    isRtl: true,
  },
  {
    name: "French",
    flag: "🇫🇷",
    students: "1.2M+",
    teachers: "680+",
    rating: 4.9,
    difficulty: "Medium",
    description:
      "The language of love and diplomacy. Essential for fashion, cuisine, and arts.",
    popular: true,
    trending: false,
  },
  {
    name: "German",
    flag: "🇩🇪",
    students: "800K+",
    teachers: "420+",
    rating: 4.7,
    difficulty: "Medium",
    description:
      "Key for business in Europe. Strong in engineering, science, and technology sectors.",
    popular: true,
    trending: false,
  },
  {
    name: "Chinese (Mandarin)",
    flag: "🇨🇳",
    students: "1.5M+",
    teachers: "780+",
    rating: 4.8,
    difficulty: "Hard",
    description:
      "The most spoken language in the world. Essential for business in Asia.",
    popular: true,
    trending: true,
  },
  {
    name: "Japanese",
    flag: "🇯🇵",
    students: "900K+",
    teachers: "520+",
    rating: 4.9,
    difficulty: "Hard",
    description:
      "Gateway to Japanese culture, anime, and business opportunities in Japan.",
    popular: true,
    trending: true,
  },
  {
    name: "Italian",
    flag: "🇮🇹",
    students: "600K+",
    teachers: "380+",
    rating: 4.8,
    difficulty: "Medium",
    description:
      "Beautiful language of art, culture, and cuisine. Perfect for travel enthusiasts.",
    popular: false,
    trending: false,
  },
  {
    name: "Portuguese",
    flag: "🇧🇷",
    students: "450K+",
    teachers: "280+",
    rating: 4.7,
    difficulty: "Medium",
    description:
      "Spoken in Brazil and Portugal. Growing importance in international business.",
    popular: false,
    trending: true,
  },
  {
    name: "Russian",
    flag: "🇷🇺",
    students: "350K+",
    teachers: "210+",
    rating: 4.6,
    difficulty: "Hard",
    description:
      "Widely spoken in Eastern Europe and Central Asia. Rich literary tradition.",
    popular: false,
    trending: false,
  },
  {
    name: "Korean",
    flag: "🇰🇷",
    students: "700K+",
    teachers: "340+",
    rating: 4.9,
    difficulty: "Hard",
    description:
      "Rising popularity due to K-pop and Korean culture. Growing tech industry.",
    popular: false,
    trending: true,
  },
  {
    name: "Arabic",
    flag: "🇸🇦",
    students: "400K+",
    teachers: "250+",
    rating: 4.7,
    difficulty: "Hard",
    description:
      "Spoken by 400M+ people. Important for business in Middle East and North Africa.",
    popular: false,
    trending: false,
  },
  {
    name: "Dutch",
    flag: "🇳🇱",
    students: "180K+",
    teachers: "120+",
    rating: 4.8,
    difficulty: "Medium",
    description:
      "Useful for living in Netherlands or Belgium. Similar to German and English.",
    popular: false,
    trending: false,
  },
];

const categories = [
  {
    title: "Most Popular",
    description: "The languages most students are learning",
    languages: languages.filter((lang) => lang.popular),
  },
  {
    title: "Trending Now",
    description: "Languages with rapidly growing demand",
    languages: languages.filter((lang) => lang.trending),
  },
  {
    title: "Easy to Learn",
    description: "Perfect for beginners",
    languages: languages.filter((lang) => lang.difficulty === "Easy"),
  },
  {
    title: "All Languages",
    description: "Complete list of available languages",
    languages: languages,
  },
];

export default function Languages() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Most Popular");

  const filteredLanguages = categories
    .find((cat) => cat.title === selectedCategory)
    ?.languages.filter((lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
              <Globe className="w-3 h-3 mr-1" />
              50+ Languages Available
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Learn Any Language with
              <span className="text-primary"> Native Speakers</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              From popular languages like English and Spanish to unique ones
              like Korean and Arabic. Find native speaker teachers for any
              language you want to learn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search languages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button asChild>
                <Link to="/teachers">Find Teachers</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-4 mb-12 justify-center">
              {categories.map((category) => (
                <Button
                  key={category.title}
                  variant={
                    selectedCategory === category.title ? "default" : "outline"
                  }
                  onClick={() => setSelectedCategory(category.title)}
                >
                  {category.title}
                </Button>
              ))}
            </div>

            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2">{selectedCategory}</h2>
              <p className="text-muted-foreground">
                {
                  categories.find((cat) => cat.title === selectedCategory)
                    ?.description
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredLanguages?.map((language, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{language.flag}</span>
                        <div>
                          <CardTitle className="text-xl">
                            {language.name}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">
                              {language.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge
                          className={getDifficultyColor(language.difficulty)}
                        >
                          {language.difficulty}
                        </Badge>
                        {language.trending && (
                          <Badge variant="outline" className="text-xs">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {language.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Users className="w-4 h-4 text-primary mr-1" />
                        </div>
                        <div className="text-sm font-medium">
                          {language.students}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Students
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <BookOpen className="w-4 h-4 text-primary mr-1" />
                        </div>
                        <div className="text-sm font-medium">
                          {language.teachers}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Teachers
                        </div>
                      </div>
                    </div>
                    <Button className="w-full" asChild>
                      <Link
                        to={`/teachers?language=${language.name.toLowerCase()}`}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Find {language.name} Teachers
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredLanguages?.length === 0 && (
              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No languages found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or browse all languages
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Why Learn Languages with Talkcon?
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              The best way to learn any language is with native speakers
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Native Speakers</h3>
                <p className="text-muted-foreground text-sm">
                  Learn authentic pronunciation and cultural nuances from native
                  speakers
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Personalized Learning
                </h3>
                <p className="text-muted-foreground text-sm">
                  Every lesson is tailored to your goals, interests, and
                  learning style
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Global Community</h3>
                <p className="text-muted-foreground text-sm">
                  Connect with teachers and students from around the world
                </p>
              </div>
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
              Choose your language and find the perfect teacher today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/teachers">Browse All Teachers</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/signup">Start Learning Today</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
