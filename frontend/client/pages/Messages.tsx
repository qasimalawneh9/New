import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Calendar,
  Clock,
  CheckCheck,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isTeacher: boolean;
  rating?: number;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: "text" | "booking" | "lesson_reminder" | "file";
  isRead: boolean;
}

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Maria Rodriguez",
    avatar: "/placeholder.svg",
    isOnline: true,
    lastMessage: "Great job in today's lesson! Here's your homework...",
    lastMessageTime: "2 min ago",
    unreadCount: 2,
    isTeacher: true,
    rating: 4.9,
  },
  {
    id: "2",
    name: "James Wilson",
    avatar: "/placeholder.svg",
    isOnline: false,
    lastMessage: "Don't forget about tomorrow's business presentation practice",
    lastMessageTime: "1 hour ago",
    unreadCount: 0,
    isTeacher: true,
    rating: 4.8,
  },
  {
    id: "3",
    name: "Li Wei",
    avatar: "/placeholder.svg",
    isOnline: true,
    lastMessage: "你好! Ready for our next Chinese lesson?",
    lastMessageTime: "3 hours ago",
    unreadCount: 1,
    isTeacher: true,
    rating: 4.9,
  },
  {
    id: "4",
    name: "Sophie Dubois",
    avatar: "/placeholder.svg",
    isOnline: false,
    lastMessage: "Merci beaucoup for the cultural insights!",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    isTeacher: true,
    rating: 4.7,
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "1",
    content:
      "¡Hola! How are you feeling about today's lesson? I think you made great progress with the subjunctive mood.",
    timestamp: "2024-01-15T14:30:00Z",
    type: "text",
    isRead: true,
  },
  {
    id: "2",
    senderId: "student1",
    content:
      "Hi Maria! I feel much more confident now. Thank you for the detailed explanations.",
    timestamp: "2024-01-15T14:32:00Z",
    type: "text",
    isRead: true,
  },
  {
    id: "3",
    senderId: "1",
    content:
      "Excellent! For homework, please practice the exercises we discussed and write 5 sentences using the subjunctive. Don't worry if it feels challenging at first.",
    timestamp: "2024-01-15T14:35:00Z",
    type: "text",
    isRead: true,
  },
  {
    id: "4",
    senderId: "1",
    content: "I've scheduled our next lesson for Friday at 3 PM. See you then!",
    timestamp: "2024-01-15T14:36:00Z",
    type: "booking",
    isRead: false,
  },
  {
    id: "5",
    senderId: "student1",
    content: "Perfect! I'll complete the homework before our next session.",
    timestamp: "2024-01-15T14:38:00Z",
    type: "text",
    isRead: true,
  },
];

export default function Messages() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(
    mockContacts[0],
  );
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: "student1",
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: "text",
      isRead: false,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const filteredContacts = mockContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Contacts Sidebar */}
        <div className="w-80 border-r bg-muted/30 flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={cn(
                  "p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b",
                  selectedContact?.id === contact.id && "bg-primary/10",
                )}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>
                        {contact.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {contact.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium truncate">{contact.name}</h3>
                        {contact.isTeacher && (
                          <Badge variant="secondary" className="text-xs">
                            Teacher
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        {contact.rating && (
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-muted-foreground ml-1">
                              {contact.rating}
                            </span>
                          </div>
                        )}
                        {contact.unreadCount > 0 && (
                          <Badge className="h-5 w-5 rounded-full p-0 text-xs">
                            {contact.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {contact.lastMessage}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {contact.lastMessageTime}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-background">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={selectedContact.avatar}
                          alt={selectedContact.name}
                        />
                        <AvatarFallback>
                          {selectedContact.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {selectedContact.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedContact.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedContact.isOnline
                          ? "Online"
                          : "Last seen 2h ago"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.senderId === "student1"
                        ? "justify-end"
                        : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg px-4 py-2",
                        message.senderId === "student1"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted",
                        message.type === "booking" &&
                          "border-l-4 border-accent bg-accent/10",
                      )}
                    >
                      {message.type === "booking" && (
                        <div className="flex items-center mb-2">
                          <Calendar className="h-4 w-4 mr-2 text-accent" />
                          <span className="font-medium text-accent">
                            Lesson Scheduled
                          </span>
                        </div>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-end mt-2 space-x-1">
                        <span className="text-xs opacity-70">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.senderId === "student1" && (
                          <CheckCheck
                            className={cn(
                              "h-3 w-3",
                              message.isRead ? "text-blue-500" : "opacity-50",
                            )}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-background">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Select a conversation
                </h3>
                <p className="text-muted-foreground">
                  Choose a contact to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
