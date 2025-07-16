import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Video,
  Download,
  Users,
  Clock,
  Star,
  Search,
  Filter,
  PlayCircle,
  FileText,
  Lightbulb,
  Target,
  Award,
  MessageCircle,
  TrendingUp,
  Globe,
  Brain,
  Mic,
  Gamepad2,
  Calendar,
  CheckCircle,
  Settings,
} from "lucide-react";

const categories = [
  { id: "all", name: "All Resources", count: 127 },
  { id: "lesson-plans", name: "Lesson Plans", count: 45 },
  { id: "activities", name: "Activities", count: 32 },
  { id: "assessments", name: "Assessments", count: 18 },
  { id: "technology", name: "Technology", count: 15 },
  { id: "classroom-management", name: "Classroom Management", count: 12 },
  {
    id: "professional-development",
    name: "Professional Development",
    count: 5,
  },
];

const featuredResources = [
  {
    id: "conversation-starters",
    title: "500 Conversation Starters for All Levels",
    description:
      "Ready-to-use conversation prompts organized by proficiency level and topic. Perfect for breaking the ice and encouraging natural conversation in your lessons.",
    category: "Speaking Activities",
    type: "PDF Resource Pack",
    downloads: 3247,
    rating: 4.9,
    image: "/placeholder.svg",
    tags: ["Speaking", "Conversation", "All Levels"],
    duration: "Instant use",
    level: "All Levels",
    content: {
      beginner: [
        "Tell me about your family. How many people are in your family?",
        "What did you eat for breakfast today? Do you like cooking?",
        "Describe your hometown. What is the weather like there?",
        "What hobbies do you have? When did you start this hobby?",
        "What is your favorite movie? Why do you like it?",
      ],
      intermediate: [
        "If you could travel anywhere in the world, where would you go and why?",
        "What changes would you make if you were the leader of your country?",
        "Describe a time when you had to overcome a difficult challenge.",
        "How do you think technology will change our lives in the next 10 years?",
        "What advice would you give to someone learning your native language?",
      ],
      advanced: [
        "What role do you think artificial intelligence should play in education?",
        "How has globalization affected traditional cultures in your opinion?",
        "Discuss the ethical implications of genetic engineering in medicine.",
        "What are the most pressing environmental issues we face today?",
        "How do you think social media has changed the way we communicate?",
      ],
    },
  },
  {
    id: "grammar-games",
    title: "25 Grammar Games That Actually Work",
    description:
      "Turn boring grammar lessons into engaging activities. Each game includes instructions, materials needed, and variations for different levels.",
    category: "Grammar Activities",
    type: "Interactive Guide",
    downloads: 2156,
    rating: 4.8,
    image: "/placeholder.svg",
    tags: ["Grammar", "Games", "Interactive"],
    duration: "15-30 min each",
    level: "All Levels",
    content: {
      games: [
        {
          name: "Grammar Auction",
          level: "Intermediate-Advanced",
          time: "20-25 minutes",
          description:
            "Students bid on sentences, deciding which are grammatically correct",
          materials: "Play money, sentence cards, auction hammer (optional)",
        },
        {
          name: "Verb Tense Timeline",
          level: "Beginner-Intermediate",
          time: "15-20 minutes",
          description:
            "Students place events on a timeline using correct verb tenses",
          materials: "Timeline template, event cards",
        },
      ],
    },
  },
  {
    id: "pronunciation-drills",
    title: "Pronunciation Practice Toolkit",
    description:
      "Systematic approach to teaching pronunciation with mouth position diagrams, audio examples, and practice exercises for common problem sounds.",
    category: "Pronunciation",
    type: "Multimedia Pack",
    downloads: 1892,
    rating: 4.7,
    image: "/placeholder.svg",
    tags: ["Pronunciation", "Audio", "Visual"],
    duration: "10-20 min drills",
    level: "All Levels",
    content: {
      sounds: [
        {
          sound: "/θ/ (th)",
          description: "Tongue between teeth, breathe out",
          words: ["think", "three", "birthday", "mathematics"],
          exercises: "Minimal pairs: think/sink, three/tree",
        },
        {
          sound: "/r/ vs /l/",
          description: "Tongue tip position difference",
          words: ["right/light", "rock/lock", "pray/play"],
          exercises: "Tongue twisters and word discrimination",
        },
      ],
    },
  },
  {
    id: "lesson-templates",
    title: "Complete Lesson Plan Templates",
    description:
      "Professional 60-minute lesson plans for speaking, grammar, vocabulary, and skills practice. Includes warm-up, main activities, and wrap-up sections.",
    category: "Lesson Planning",
    type: "Template Collection",
    downloads: 4567,
    rating: 4.9,
    image: "/placeholder.svg",
    tags: ["Templates", "Planning", "Structure"],
    duration: "60 min lessons",
    level: "All Levels",
    content: {
      template: {
        warmUp: "5-10 minutes: Review previous lesson, small talk, mood check",
        presentation:
          "15-20 minutes: Introduce new language/topic with examples",
        practice: "20-25 minutes: Controlled and guided practice activities",
        production: "10-15 minutes: Free practice/communication activities",
        wrapUp: "5 minutes: Summary, homework, next lesson preview",
      },
    },
  },
  {
    id: "cultural-topics",
    title: "Cultural Discussion Topics by Country",
    description:
      "Engage students with cultural topics from their target language country. Includes discussion questions, cultural facts, and comparison activities.",
    category: "Cultural Content",
    type: "Discussion Guide",
    downloads: 1679,
    rating: 4.6,
    image: "/placeholder.svg",
    tags: ["Culture", "Discussion", "Global"],
    duration: "30-45 min",
    level: "Intermediate-Advanced",
    content: {
      topics: [
        {
          country: "United States",
          topic: "Thanksgiving Traditions",
          questions: [
            "How do families typically celebrate Thanksgiving?",
            "What foods are traditional for this holiday?",
            "How has Thanksgiving changed over time?",
          ],
        },
        {
          country: "United Kingdom",
          topic: "Tea Culture",
          questions: [
            "Why is tea so important in British culture?",
            "What's the difference between afternoon tea and high tea?",
            "How do tea customs vary across the UK?",
          ],
        },
      ],
    },
  },
  {
    id: "assessment-rubrics",
    title: "Speaking & Writing Assessment Rubrics",
    description:
      "Professional rubrics for evaluating student progress in speaking and writing. Aligned with CEFR levels with clear descriptors and scoring guides.",
    category: "Assessment",
    type: "Evaluation Tools",
    downloads: 2234,
    rating: 4.8,
    image: "/placeholder.svg",
    tags: ["Assessment", "CEFR", "Rubrics"],
    duration: "Ongoing use",
    level: "All Levels",
    content: {
      speaking: {
        fluency: "Natural pace, minimal hesitation, smooth flow",
        accuracy: "Correct grammar and vocabulary usage",
        pronunciation: "Clear articulation, appropriate stress and intonation",
        interaction: "Effective communication, turn-taking, responses",
      },
      writing: {
        content: "Relevant ideas, logical development, task completion",
        organization: "Clear structure, cohesion, paragraph development",
        language: "Range and accuracy of vocabulary and grammar",
        mechanics: "Spelling, punctuation, formatting",
      },
    },
  },
];

const quickTips = [
  {
    icon: Brain,
    title: "Memory Techniques",
    description:
      "Help students remember vocabulary using proven memory methods",
  },
  {
    icon: Mic,
    title: "Pronunciation Practice",
    description: "Effective techniques for improving student pronunciation",
  },
  {
    icon: Gamepad2,
    title: "Gamification",
    description: "Make learning fun with game-based teaching approaches",
  },
  {
    icon: Target,
    title: "Goal Setting",
    description: "Help students set and achieve realistic language goals",
  },
];

const webinars = [
  {
    title: "Mastering Conversational Flow: Advanced Speaking Techniques",
    date: "Feb 2, 2024",
    time: "2:00 PM EST",
    presenter: "Dr. Sarah Chen, PhD in Applied Linguistics",
    attendees: 345,
    status: "upcoming",
    description:
      "Learn how to guide students from basic exchanges to natural, flowing conversations using proven techniques from cognitive psychology.",
    topics: [
      "Conversation scaffolding",
      "Error correction timing",
      "Natural transition techniques",
      "Building student confidence",
    ],
  },
  {
    title: "Teaching Business English: From Emails to Presentations",
    date: "Jan 28, 2024",
    time: "11:00 AM EST",
    presenter: "James Morrison, Corporate Training Specialist",
    attendees: 278,
    status: "upcoming",
    description:
      "Comprehensive training on teaching professional English skills including formal writing, meeting participation, and presentation delivery.",
    topics: [
      "Professional writing styles",
      "Meeting language functions",
      "Presentation structures",
      "Cross-cultural business communication",
    ],
  },
  {
    title: "Cultural Sensitivity in Global Language Teaching",
    date: "Jan 21, 2024",
    time: "3:00 PM EST",
    presenter: "Prof. Miguel Rodriguez, International Education Expert",
    attendees: 412,
    status: "completed",
    description:
      "Navigate cultural differences respectfully while teaching language, including how to address sensitive topics and avoid cultural stereotypes.",
    topics: [
      "Cultural awareness frameworks",
      "Inclusive teaching practices",
      "Addressing cultural conflicts",
      "Building global competence",
    ],
  },
  {
    title: "Digital Tools That Transform Language Learning",
    date: "Jan 14, 2024",
    time: "1:00 PM EST",
    presenter: "Emily Watson, EdTech Specialist",
    attendees: 523,
    status: "completed",
    description:
      "Hands-on workshop covering the best digital tools for vocabulary building, grammar practice, pronunciation training, and progress tracking.",
    topics: [
      "Interactive whiteboard techniques",
      "Gamification platforms",
      "AI-powered assessment tools",
      "Virtual reality language immersion",
    ],
  },
  {
    title: "Assessment Strategies for Online Language Learning",
    date: "Jan 7, 2024",
    time: "10:00 AM EST",
    presenter: "Dr. Lisa Park, Testing and Assessment Expert",
    attendees: 267,
    status: "completed",
    description:
      "Learn to design effective assessments for online environments, provide meaningful feedback, and track student progress accurately.",
    topics: [
      "Formative vs summative assessment",
      "Online testing best practices",
      "Portfolio-based assessment",
      "Feedback that motivates",
    ],
  },
  {
    title: "Teaching Grammar Without the Boredom",
    date: "Dec 31, 2023",
    time: "2:30 PM EST",
    presenter: "Mark Thompson, Grammar Teaching Innovator",
    attendees: 189,
    status: "completed",
    description:
      "Transform grammar lessons into engaging activities using stories, games, and real-world contexts that make rules memorable and applicable.",
    topics: [
      "Grammar through storytelling",
      "Communicative grammar activities",
      "Error analysis techniques",
      "Making rules stick",
    ],
  },
];

export default function TeacherResources() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Teaching Resources
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Everything you need to excel as a language teacher. Lesson plans,
              activities, assessments, and professional development resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  className="pl-10 w-full sm:w-80"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={category.id === "all" ? "default" : "ghost"}
                    className="w-full justify-between"
                    size="sm"
                  >
                    <span>{category.name}</span>
                    <Badge variant="secondary">{category.count}</Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Teaching Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickTips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <tip.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{tip.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Community */}
            <Card>
              <CardHeader>
                <CardTitle>Teacher Community</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Join Discussion Forum
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Teacher Mentorship
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Award className="w-4 h-4 mr-2" />
                  Certification Programs
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Tabs */}
            <Tabs defaultValue="resources" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="webinars">Webinars</TabsTrigger>
                <TabsTrigger value="guides">Guides</TabsTrigger>
                <TabsTrigger value="tools">Tools</TabsTrigger>
              </TabsList>

              <TabsContent value="resources" className="space-y-6">
                {/* Featured Resources */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    Featured Resources
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredResources.map((resource) => (
                      <Card
                        key={resource.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="aspect-video bg-muted relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <PlayCircle className="h-12 w-12 text-primary" />
                          </div>
                          <div className="absolute top-3 left-3">
                            <Badge>{resource.type}</Badge>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold line-clamp-2">
                              {resource.title}
                            </h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                              {resource.rating}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {resource.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {resource.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {resource.duration}
                            </div>
                            <div className="flex items-center">
                              <Download className="w-4 h-4 mr-1" />
                              {resource.downloads.toLocaleString()}
                            </div>
                          </div>
                          <Button className="w-full">
                            <Download className="w-4 h-4 mr-2" />
                            Download Resource
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Resource Categories */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    Browse by Category
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        name: "Lesson Plans",
                        icon: BookOpen,
                        count: 45,
                        color: "bg-blue-100 text-blue-600",
                      },
                      {
                        name: "Activities",
                        icon: Gamepad2,
                        count: 32,
                        color: "bg-green-100 text-green-600",
                      },
                      {
                        name: "Assessments",
                        icon: CheckCircle,
                        count: 18,
                        color: "bg-purple-100 text-purple-600",
                      },
                      {
                        name: "Technology",
                        icon: Globe,
                        count: 15,
                        color: "bg-orange-100 text-orange-600",
                      },
                      {
                        name: "Professional Dev",
                        icon: TrendingUp,
                        count: 12,
                        color: "bg-pink-100 text-pink-600",
                      },
                      {
                        name: "Templates",
                        icon: FileText,
                        count: 25,
                        color: "bg-indigo-100 text-indigo-600",
                      },
                    ].map((category) => (
                      <Card
                        key={category.name}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <CardContent className="p-6 text-center">
                          <div
                            className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mx-auto mb-3`}
                          >
                            <category.icon className="w-6 h-6" />
                          </div>
                          <h3 className="font-semibold mb-1">
                            {category.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {category.count} resources
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="webinars" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    Professional Development Webinars
                  </h2>
                  <div className="space-y-4">
                    {webinars.map((webinar, index) => (
                      <Card
                        key={index}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold text-lg">
                                  {webinar.title}
                                </h3>
                                <Badge
                                  variant={
                                    webinar.status === "upcoming"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {webinar.status}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {webinar.date} at {webinar.time}
                                </div>
                                <div className="flex items-center">
                                  <Users className="w-4 h-4 mr-1" />
                                  {webinar.attendees}{" "}
                                  {webinar.status === "upcoming"
                                    ? "registered"
                                    : "attended"}
                                </div>
                              </div>
                              <p className="text-sm font-medium text-primary mb-2">
                                Presented by {webinar.presenter}
                              </p>
                              <p className="text-sm text-muted-foreground mb-3">
                                {webinar.description}
                              </p>
                              <div className="mb-3">
                                <p className="text-xs font-medium text-gray-700 mb-2">
                                  Topics covered:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {webinar.topics.map((topic, i) => (
                                    <Badge
                                      key={i}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {topic}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                              Duration: 90 minutes including Q&A
                            </div>
                            <Button
                              variant={
                                webinar.status === "upcoming"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {webinar.status === "upcoming"
                                ? "Register Free"
                                : "Watch Recording"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="guides" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    Complete Teaching Guides
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        title: "The Complete Online Teaching Manual",
                        description:
                          "Master online language teaching with technical setup, platform navigation, digital classroom management, and virtual lesson planning strategies.",
                        pages: 67,
                        downloads: 3840,
                        content: {
                          chapters: [
                            "Setting Up Your Digital Classroom",
                            "Technology Troubleshooting Guide",
                            "Online Lesson Structure & Timing",
                            "Digital Whiteboard Techniques",
                            "Managing Online Student Behavior",
                            "Recording and Screen Sharing Best Practices",
                          ],
                        },
                      },
                      {
                        title: "Student Motivation & Engagement Playbook",
                        description:
                          "Research-backed strategies to keep students motivated, engaged, and coming back for more lessons. Includes personality-based teaching approaches.",
                        pages: 45,
                        downloads: 2967,
                        content: {
                          strategies: [
                            "Goal-setting frameworks for language learners",
                            "Gamification techniques for adult learners",
                            "Using positive psychology in language teaching",
                            "Adapting to different learning styles",
                            "Building student confidence and reducing anxiety",
                          ],
                        },
                      },
                      {
                        title: "Assessment & Progress Tracking Handbook",
                        description:
                          "Design effective assessments, provide meaningful feedback, and track student progress using both formal and informal evaluation methods.",
                        pages: 52,
                        downloads: 2156,
                        content: {
                          topics: [
                            "Formative vs Summative Assessment",
                            "CEFR Level Assessment Guidelines",
                            "Portfolio-based Assessment Methods",
                            "Providing Effective Corrective Feedback",
                            "Digital Progress Tracking Tools",
                          ],
                        },
                      },
                      {
                        title: "Cross-Cultural Communication Guide",
                        description:
                          "Navigate cultural differences, avoid misunderstandings, and create inclusive learning environments for students from diverse backgrounds.",
                        pages: 38,
                        downloads: 1789,
                        content: {
                          sections: [
                            "Understanding Cultural Learning Styles",
                            "Avoiding Cultural Stereotypes",
                            "Teaching Pragmatics and Social Context",
                            "Addressing Sensitive Cultural Topics",
                            "Building Cultural Awareness Activities",
                          ],
                        },
                      },
                      {
                        title: "Business English Teaching Specialist Guide",
                        description:
                          "Comprehensive guide to teaching Business English including industry-specific vocabulary, professional communication skills, and corporate training methods.",
                        pages: 74,
                        downloads: 1634,
                        content: {
                          modules: [
                            "Industry-Specific Business Vocabulary",
                            "Email and Business Writing Skills",
                            "Presentation and Meeting Skills",
                            "Negotiation and Persuasion Language",
                            "Cross-Cultural Business Communication",
                          ],
                        },
                      },
                      {
                        title: "Teaching Children & Teenagers Manual",
                        description:
                          "Age-appropriate teaching methods, classroom management for young learners, parent communication, and engaging activities for kids and teens.",
                        pages: 59,
                        downloads: 2445,
                        content: {
                          ageGroups: [
                            "Young Learners (5-8): Games and Songs",
                            "Elementary (9-12): Interactive Activities",
                            "Teenagers (13-17): Real-world Projects",
                            "Managing Energy and Attention Spans",
                            "Parent Communication and Updates",
                          ],
                        },
                      },
                    ].map((guide, index) => (
                      <Card
                        key={index}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-6">
                          <h3 className="font-semibold mb-2">{guide.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {guide.description}
                          </p>
                          <div className="mb-4">
                            <p className="text-xs font-medium text-primary mb-2">
                              What's included:
                            </p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {(
                                guide.content.chapters ||
                                guide.content.strategies ||
                                guide.content.topics ||
                                guide.content.sections ||
                                guide.content.modules ||
                                guide.content.ageGroups
                              )
                                ?.slice(0, 3)
                                .map((item, i) => (
                                  <li key={i} className="flex items-center">
                                    <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              {(
                                guide.content.chapters ||
                                guide.content.strategies ||
                                guide.content.topics ||
                                guide.content.sections ||
                                guide.content.modules ||
                                guide.content.ageGroups
                              )?.length > 3 && (
                                <li className="text-primary text-xs">
                                  +{" "}
                                  {(
                                    guide.content.chapters ||
                                    guide.content.strategies ||
                                    guide.content.topics ||
                                    guide.content.sections ||
                                    guide.content.modules ||
                                    guide.content.ageGroups
                                  )?.length - 3}{" "}
                                  more topics
                                </li>
                              )}
                            </ul>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                            <span>{guide.pages} pages</span>
                            <span>
                              {guide.downloads.toLocaleString()} downloads
                            </span>
                          </div>
                          <Button className="w-full">
                            <Download className="w-4 h-4 mr-2" />
                            Download Guide
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tools" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    Ready-to-Use Teaching Tools & Templates
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        name: "Complete Lesson Plan Templates",
                        description:
                          "60-minute lesson structures for grammar, conversation, business English, and test prep with detailed timing and activities",
                        type: "Word/PDF Templates",
                        icon: FileText,
                        contents: [
                          "Grammar lesson template with examples",
                          "Conversation class structure",
                          "Business English lesson format",
                          "Test preparation lesson plan",
                        ],
                        downloads: 4521,
                      },
                      {
                        name: "Student Progress Tracking System",
                        description:
                          "Excel spreadsheet to track vocabulary learned, grammar points covered, and skill development over time",
                        type: "Excel Spreadsheet",
                        icon: TrendingUp,
                        contents: [
                          "Individual student progress sheets",
                          "Class overview dashboard",
                          "Skill development tracker",
                          "Goal setting templates",
                        ],
                        downloads: 3287,
                      },
                      {
                        name: "500+ Conversation Starters Collection",
                        description:
                          "Categorized by level and topic - perfect for warm-ups, main activities, or when conversation runs dry",
                        type: "PDF Collection",
                        icon: MessageCircle,
                        contents: [
                          "Beginner conversation starters",
                          "Intermediate discussion topics",
                          "Advanced debate questions",
                          "Business networking prompts",
                        ],
                        downloads: 6734,
                      },
                      {
                        name: "Grammar Practice Worksheet Bundle",
                        description:
                          "50+ printable worksheets covering essential grammar points with answer keys and teacher notes",
                        type: "PDF Worksheet Pack",
                        icon: BookOpen,
                        contents: [
                          "Verb tense practice sheets",
                          "Articles and prepositions",
                          "Conditional sentences",
                          "Modal verbs and phrasal verbs",
                        ],
                        downloads: 5643,
                      },
                      {
                        name: "CEFR Assessment Rubrics",
                        description:
                          "Professional rubrics aligned with Common European Framework levels for speaking and writing assessment",
                        type: "Assessment Tools",
                        icon: CheckCircle,
                        contents: [
                          "Speaking assessment rubric (A1-C2)",
                          "Writing evaluation criteria",
                          "Self-assessment forms",
                          "Progress milestone checklists",
                        ],
                        downloads: 2789,
                      },
                      {
                        name: "Student Feedback & Evaluation Forms",
                        description:
                          "Collect structured feedback on lessons, teaching style, and course content to improve your teaching",
                        type: "Fillable Forms",
                        icon: Star,
                        contents: [
                          "Lesson feedback form",
                          "Course evaluation survey",
                          "Teacher performance feedback",
                          "Goal-setting worksheets",
                        ],
                        downloads: 2156,
                      },
                      {
                        name: "Vocabulary Building Activities",
                        description:
                          "Games, exercises, and creative activities to help students learn and retain new vocabulary effectively",
                        type: "Activity Pack",
                        icon: Lightbulb,
                        contents: [
                          "Word association games",
                          "Vocabulary bingo templates",
                          "Context clue exercises",
                          "Memory palace techniques",
                        ],
                        downloads: 4321,
                      },
                      {
                        name: "Pronunciation Practice Tools",
                        description:
                          "Visual guides, mouth position diagrams, and practice exercises for common pronunciation challenges",
                        type: "Multimedia Pack",
                        icon: Mic,
                        contents: [
                          "IPA pronunciation guide",
                          "Mouth position diagrams",
                          "Minimal pairs practice",
                          "Stress and intonation patterns",
                        ],
                        downloads: 1967,
                      },
                      {
                        name: "Digital Classroom Management Kit",
                        description:
                          "Tools and templates for managing online classes including attendance, homework tracking, and virtual classroom rules",
                        type: "Digital Tools",
                        icon: Settings,
                        contents: [
                          "Virtual classroom rules template",
                          "Online attendance tracker",
                          "Homework assignment forms",
                          "Technical troubleshooting guide",
                        ],
                        downloads: 1543,
                      },
                    ].map((tool, index) => (
                      <Card
                        key={index}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <tool.icon className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="font-semibold mb-2 text-center">
                            {tool.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4 text-center">
                            {tool.description}
                          </p>
                          <div className="mb-4">
                            <p className="text-xs font-medium text-primary mb-2">
                              Includes:
                            </p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {tool.contents.map((item, i) => (
                                <li key={i} className="flex items-center">
                                  <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="text-center mb-3">
                            <Badge variant="outline" className="mb-2">
                              {tool.type}
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              {tool.downloads.toLocaleString()} downloads
                            </p>
                          </div>
                          <Button className="w-full">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 mt-16 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Teaching?</h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands of teachers who are making a difference in students'
            lives
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/teacher-application">Apply to Teach</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
              asChild
            >
              <Link to="/teacher-support">Get Support</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
