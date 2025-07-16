import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  MessageCircle,
  Share,
  Settings,
  Maximize,
  Minimize,
  Users,
  Clock,
  FileText,
  Send,
  Download,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  sender: "teacher" | "student";
  senderName: string;
  message: string;
  timestamp: string;
  type: "text" | "file" | "whiteboard";
}

export default function LessonRoom() {
  const { id } = useParams<{ id: string }>();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "teacher",
      senderName: "Maria Rodriguez",
      message: "Welcome to our Spanish lesson! Ready to practice?",
      timestamp: "14:30",
      type: "text",
    },
    {
      id: "2",
      sender: "student",
      senderName: "You",
      message: "Yes, I'm excited to learn!",
      timestamp: "14:31",
      type: "text",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [lessonDuration, setLessonDuration] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Timer for lesson duration
  useEffect(() => {
    const timer = setInterval(() => {
      setLessonDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: "student",
      senderName: "You",
      message: newMessage,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      }),
      type: "text",
    };

    setChatMessages([...chatMessages, message]);
    setNewMessage("");
  };

  const handleEndLesson = () => {
    // In a real app, this would end the video call and redirect
    console.log("Ending lesson...");
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg" alt="Maria Rodriguez" />
              <AvatarFallback>MR</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">Spanish Lesson with Maria</h2>
              <p className="text-sm text-muted-foreground">
                Business Spanish • Intermediate Level
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <Clock className="w-3 h-3 mr-1" />
              {formatTime(lessonDuration)}
            </Badge>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleEndLesson}
              className="bg-red-500 hover:bg-red-600"
            >
              <PhoneOff className="w-4 h-4 mr-2" />
              End Lesson
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-black relative">
            {/* Teacher Video */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center text-white">
                <Avatar className="h-32 w-32 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg" alt="Maria Rodriguez" />
                  <AvatarFallback className="text-2xl">MR</AvatarFallback>
                </Avatar>
                <h3 className="text-2xl font-semibold mb-2">Maria Rodriguez</h3>
                <Badge className="bg-green-500">
                  <Video className="w-3 h-3 mr-1" />
                  Camera On
                </Badge>
              </div>
            </div>

            {/* Student Video (Picture in Picture) */}
            <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg border-2 border-primary overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="text-center text-white">
                  <Avatar className="h-16 w-16 mx-auto mb-2">
                    <AvatarImage src="/placeholder.svg" alt="You" />
                    <AvatarFallback>YO</AvatarFallback>
                  </Avatar>
                  <p className="text-sm">You</p>
                  {!isVideoOn && (
                    <Badge variant="secondary" className="mt-1">
                      <VideoOff className="w-3 h-3 mr-1" />
                      Camera Off
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-black/70 backdrop-blur-sm rounded-full p-2 flex items-center space-x-2">
                <Button
                  variant={isVideoOn ? "default" : "destructive"}
                  size="icon"
                  className="rounded-full"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                >
                  {isVideoOn ? (
                    <Video className="w-4 h-4" />
                  ) : (
                    <VideoOff className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant={isAudioOn ? "default" : "destructive"}
                  size="icon"
                  className="rounded-full"
                  onClick={() => setIsAudioOn(!isAudioOn)}
                >
                  {isAudioOn ? (
                    <Mic className="w-4 h-4" />
                  ) : (
                    <MicOff className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/10 border-white/20"
                >
                  <Share className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/10 border-white/20"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? (
                    <Minimize className="w-4 h-4" />
                  ) : (
                    <Maximize className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/10 border-white/20"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l bg-muted/30 flex flex-col">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <div className="p-4 border-b">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chat" className="text-xs">
                  Chat
                </TabsTrigger>
                <TabsTrigger value="materials" className="text-xs">
                  Materials
                </TabsTrigger>
                <TabsTrigger value="notes" className="text-xs">
                  Notes
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="flex-1 flex flex-col m-0">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.sender === "student"
                        ? "justify-end"
                        : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-3 py-2",
                        message.sender === "student"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted",
                      )}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t bg-background">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="materials" className="flex-1 m-0 p-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Today's Materials</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-2 rounded border">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Business Spanish Vocab</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded border">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Grammar Exercises</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Upload Files</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="flex-1 m-0 p-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Lesson Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-muted/50 rounded">
                        <h4 className="font-medium mb-1">Key Vocabulary</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• la reunión - meeting</li>
                          <li>• el informe - report</li>
                          <li>• negociar - to negotiate</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-muted/50 rounded">
                        <h4 className="font-medium mb-1">Grammar Focus</h4>
                        <p className="text-muted-foreground">
                          Subjunctive mood in business contexts
                        </p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded">
                        <h4 className="font-medium mb-1">Homework</h4>
                        <p className="text-muted-foreground">
                          Practice 5 sentences with subjunctive
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Progress Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Vocabulary</span>
                        <span className="text-green-600">85%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: "85%" }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Grammar</span>
                        <span className="text-blue-600">70%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: "70%" }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Speaking</span>
                        <span className="text-purple-600">90%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: "90%" }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
