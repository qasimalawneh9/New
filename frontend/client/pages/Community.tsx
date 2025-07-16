import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { CreatePostDialog } from "@/components/community/CreatePostDialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  MessageCircle,
  BookOpen,
  Trophy,
  Globe,
  Star,
  Heart,
  Share2,
  Video,
  Mic,
  Camera,
  Zap,
  Target,
  Award,
  Clock,
  TrendingUp,
  MapPin,
  Calendar,
  Play,
  Pause,
  Volume2,
  Send,
  Filter,
  Search,
  Plus,
  Flame,
  ThumbsUp,
  Eye,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { db } from "@/lib/database";

// Mock data for community features
const communityStats = {
  totalMembers: 25847,
  activeToday: 1523,
  languagesSupported: 64,
  exchangesThisWeek: 3421,
};

const trendingTopics = [
  {
    id: 1,
    title: "How to master Spanish pronunciation in 30 days",
    author: "María García",
    language: "Spanish",
    replies: 234,
    likes: 567,
    views: 2340,
    timeAgo: "2 hours ago",
    category: "Tips & Tricks",
  },
  {
    id: 2,
    title: "Best French movies for intermediate learners",
    author: "Jean Dubois",
    language: "French",
    replies: 89,
    likes: 245,
    views: 1200,
    timeAgo: "4 hours ago",
    category: "Cultural Content",
  },
  {
    id: 3,
    title: "Common Japanese mistakes foreigners make",
    author: "Hiroshi Tanaka",
    language: "Japanese",
    replies: 156,
    likes: 423,
    views: 1890,
    timeAgo: "6 hours ago",
    category: "Grammar",
  },
];

const languageChallenges = [
  {
    id: 1,
    title: "30-Day Spanish Speaking Challenge",
    description: "Speak Spanish for 15 minutes every day",
    participants: 2456,
    daysLeft: 12,
    reward: "Digital Certificate + 50 Talkcon Points",
    difficulty: "Intermediate",
    language: "Spanish",
  },
  {
    id: 2,
    title: "French Poetry Reading Contest",
    description: "Record yourself reading French poetry",
    participants: 567,
    daysLeft: 5,
    reward: "Free Premium Lesson + Teacher Feature",
    difficulty: "Advanced",
    language: "French",
  },
  {
    id: 3,
    title: "Japanese Hiragana Speed Test",
    description: "How fast can you recognize hiragana?",
    participants: 1234,
    daysLeft: 18,
    reward: "Exclusive Japanese Learning Materials",
    difficulty: "Beginner",
    language: "Japanese",
  },
];

export default function Community() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  // Real data states
  const [posts, setPosts] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [realCommunityStats, setRealCommunityStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Load community data
  useEffect(() => {
    loadCommunityData();
  }, [selectedLanguage]);

  const loadCommunityData = () => {
    setLoading(true);
    try {
      const filters = { language: selectedLanguage };

      const loadedPosts = db.getPosts(filters);
      const loadedChallenges = db.getChallenges(filters);
      const stats = db.getCommunityStats();

      setPosts(loadedPosts);
      setChallenges(loadedChallenges);
      setRealCommunityStats(stats);
    } catch (error) {
      console.error("Error loading community data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = () => {
    loadCommunityData();
    toast({
      title: "Post published!",
      description: "Your post is now visible to the community.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full">
                <Users className="w-5 h-5" />
                <span className="font-medium">Global Language Community</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connect, Practice, and{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Grow Together
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our vibrant community of language learners and native
              speakers. Practice real conversations, participate in challenges,
              and make friends worldwide.
            </p>

            {/* Community Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border">
                <div className="text-2xl font-bold text-primary">
                  {communityStats.totalMembers.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Members</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border">
                <div className="text-2xl font-bold text-green-600">
                  {communityStats.activeToday.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Online Today
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border">
                <div className="text-2xl font-bold text-blue-600">
                  {communityStats.languagesSupported}
                </div>
                <div className="text-sm text-muted-foreground">Languages</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border">
                <div className="text-2xl font-bold text-purple-600">
                  {communityStats.exchangesThisWeek.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Exchanges</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="px-8">
                <Users className="w-5 h-5 mr-2" />
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Community Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
              <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-4 h-auto p-1">
                <TabsTrigger
                  value="discover"
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden sm:inline">Discover</span>
                </TabsTrigger>
                <TabsTrigger
                  value="challenges"
                  className="flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  <span className="hidden sm:inline">Challenges</span>
                </TabsTrigger>
                <TabsTrigger
                  value="practice"
                  className="flex items-center gap-2"
                >
                  <Mic className="w-4 h-4" />
                  <span className="hidden sm:inline">Practice</span>
                </TabsTrigger>
                <TabsTrigger
                  value="culture"
                  className="flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">Culture</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-4 mt-4 lg:mt-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search community..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Discover Tab */}
            <TabsContent value="discover" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Trending Discussions */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Flame className="w-6 h-6 text-orange-500" />
                      Trending Discussions
                    </h2>
                    <CreatePostDialog onPostCreated={handlePostCreated} />
                  </div>
                  <div className="space-y-4">
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <Card key={i} className="animate-pulse">
                            <CardContent className="p-6">
                              <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                              <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                              <div className="h-3 bg-muted rounded w-2/3"></div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : posts.length > 0 ? (
                      posts.map((post) => (
                        <Card
                          key={post.id}
                          className="hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarFallback>
                                    {post.authorName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">
                                      {post.authorName}
                                    </p>
                                    <Badge
                                      variant={
                                        post.authorType === "teacher"
                                          ? "default"
                                          : "secondary"
                                      }
                                      className="text-xs"
                                    >
                                      {post.authorType}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(
                                      post.createdAt,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="secondary">{post.category}</Badge>
                            </div>
                            <h3 className="font-semibold mb-2 hover:text-primary transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {post.content}
                            </p>
                            {post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {post.tags.map((tag: string) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {post.views}
                              </div>
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="w-4 h-4" />
                                {post.likes}
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                {post.replies}
                              </div>
                              <Badge variant="outline" className="ml-auto">
                                {post.language}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Card>
                        <CardContent className="p-8 text-center">
                          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="font-semibold mb-2">
                            No discussions yet
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            Be the first to start a conversation in this
                            language!
                          </p>
                          <CreatePostDialog onPostCreated={handlePostCreated} />
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>

                {/* Community Sidebar */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Start Discussion
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Trophy className="w-4 h-4 mr-2" />
                        Take Challenge
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Popular Languages */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Popular This Week
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { lang: "Spanish", posts: 234, trend: "+12%" },
                          { lang: "French", posts: 189, trend: "+8%" },
                          { lang: "Japanese", posts: 156, trend: "+15%" },
                          { lang: "German", posts: 143, trend: "+5%" },
                        ].map((item) => (
                          <div
                            key={item.lang}
                            className="flex items-center justify-between"
                          >
                            <span className="font-medium">{item.lang}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {item.posts}
                              </span>
                              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                                {item.trend}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Challenges Tab */}
            <TabsContent value="challenges" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  Language Challenges
                </h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Challenge
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {languageChallenges.map((challenge) => (
                  <Card key={challenge.id} className="relative overflow-hidden">
                    <div className="absolute top-4 right-4">
                      <Badge
                        variant={
                          challenge.difficulty === "Beginner"
                            ? "secondary"
                            : challenge.difficulty === "Intermediate"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {challenge.difficulty}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-3">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {challenge.description}
                      </p>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Participants:
                          </span>
                          <span className="font-medium">
                            {challenge.participants.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Days Left:
                          </span>
                          <span className="font-medium text-orange-600">
                            {challenge.daysLeft}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Language:
                          </span>
                          <Badge variant="outline">{challenge.language}</Badge>
                        </div>
                      </div>

                      <div className="bg-muted/50 p-3 rounded-lg mb-4">
                        <p className="text-sm font-medium mb-1">Reward:</p>
                        <p className="text-sm text-muted-foreground">
                          {challenge.reward}
                        </p>
                      </div>

                      <Button className="w-full">
                        <Target className="w-4 h-4 mr-2" />
                        Join Challenge
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Practice Tab */}
            <TabsContent value="practice" className="space-y-6">
              <div className="text-center py-12">
                <Mic className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-4">
                  Practice Hub Coming Soon
                </h2>
                <p className="text-muted-foreground mb-6">
                  Interactive practice sessions with AI tutors and voice
                  recognition
                </p>
                <Button>
                  <Zap className="w-4 h-4 mr-2" />
                  Get Early Access
                </Button>
              </div>
            </TabsContent>

            {/* Culture Tab */}
            <TabsContent value="culture" className="space-y-6">
              <div className="text-center py-12">
                <Globe className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-4">
                  Cultural Exchange Coming Soon
                </h2>
                <p className="text-muted-foreground mb-6">
                  Explore cultures through virtual tours, recipes, and local
                  insights
                </p>
                <Button>
                  <MapPin className="w-4 h-4 mr-2" />
                  Explore Cultures
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}
