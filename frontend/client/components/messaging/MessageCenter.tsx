import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Paperclip,
  Image,
  Smile,
  MoreVertical,
  Flag,
  Phone,
  Video,
  Search,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Alert, AlertDescription } from "../ui/alert";
import { ScrollArea } from "../ui/scroll-area";
import { useDropzone } from "react-dropzone";
import { Conversation, Message, Attachment, User } from "../../types/platform";
import { cn } from "../../lib/utils";
import { format, isToday, isYesterday } from "date-fns";

interface MessageCenterProps {
  currentUser: User;
  conversations: Conversation[];
  selectedConversationId?: string;
  onConversationSelect: (conversationId: string) => void;
  onSendMessage: (
    conversationId: string,
    content: string,
    attachments?: File[],
  ) => void;
  onReportMessage: (messageId: string) => void;
  className?: string;
}

interface ConversationWithUser extends Conversation {
  otherUser: User;
  messages: Message[];
}

export function MessageCenter({
  currentUser,
  conversations: rawConversations,
  selectedConversationId,
  onConversationSelect,
  onSendMessage,
  onReportMessage,
  className,
}: MessageCenterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock conversations with user data - in real app, this would come from props
  const conversations: ConversationWithUser[] = rawConversations.map(
    (conv) => ({
      ...conv,
      otherUser: {
        id: "other-user",
        name: "Teacher Name",
        email: "teacher@example.com",
        role: "teacher" as const,
        profileImage: "",
        timezone: "UTC",
        emailVerified: true,
        twoFactorEnabled: false,
        status: "active" as const,
        createdAt: "",
        updatedAt: "",
      },
      messages: [
        {
          id: "1",
          conversationId: conv.id,
          senderId: "other-user",
          content: "Hello! I'm excited for our upcoming lesson.",
          type: "text" as const,
          readAt: "",
          isReported: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          conversationId: conv.id,
          senderId: currentUser.id,
          content: "Hi! Me too, I have some questions about the lesson format.",
          type: "text" as const,
          readAt: new Date().toISOString(),
          isReported: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    }),
  );

  const selectedConversation = conversations.find(
    (conv) => conv.id === selectedConversationId,
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setAttachments((prev) => [...prev, ...acceptedFiles]);
    },
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "application/pdf": [".pdf"],
      "text/*": [".txt"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleSendMessage = () => {
    if (
      !selectedConversationId ||
      (!messageInput.trim() && attachments.length === 0)
    ) {
      return;
    }

    onSendMessage(selectedConversationId, messageInput, attachments);
    setMessageInput("");
    setAttachments([]);
  };

  const handleReportMessage = (message: Message) => {
    setSelectedMessage(message);
    setShowReportDialog(true);
  };

  const confirmReportMessage = () => {
    if (selectedMessage) {
      onReportMessage(selectedMessage.id);
      setShowReportDialog(false);
      setSelectedMessage(null);
    }
  };

  const formatMessageTime = (date: string) => {
    const messageDate = new Date(date);
    if (isToday(messageDate)) {
      return format(messageDate, "HH:mm");
    } else if (isYesterday(messageDate)) {
      return "Yesterday " + format(messageDate, "HH:mm");
    } else {
      return format(messageDate, "MMM d, HH:mm");
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  if (isMobile && selectedConversationId) {
    // Mobile view - show only selected conversation
    return (
      <div className={cn("flex flex-col h-full", className)}>
        {/* Mobile Header */}
        <div className="flex items-center gap-3 p-4 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onConversationSelect("")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Avatar className="w-8 h-8">
            <AvatarImage src={selectedConversation?.otherUser.profileImage} />
            <AvatarFallback>
              {selectedConversation?.otherUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">
              {selectedConversation?.otherUser.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {selectedConversation?.otherUser.role}
            </p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {selectedConversation?.messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUser.id}
                onReport={() => handleReportMessage(message)}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <MessageInput
          value={messageInput}
          onChange={setMessageInput}
          attachments={attachments}
          onRemoveAttachment={removeAttachment}
          onSend={handleSendMessage}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex h-full", className)}>
      {/* Conversations List */}
      <div className="w-1/3 border-r flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Messages</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <ScrollArea className="flex-1">
          <div className="p-4 pt-0 space-y-2">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={conversation.id === selectedConversationId}
                onClick={() => onConversationSelect(conversation.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={selectedConversation.otherUser.profileImage}
                  />
                  <AvatarFallback>
                    {selectedConversation.otherUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    {selectedConversation.otherUser.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedConversation.otherUser.role}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedConversation.messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.senderId === currentUser.id}
                    onReport={() => handleReportMessage(message)}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <MessageInput
              value={messageInput}
              onChange={setMessageInput}
              attachments={attachments}
              onRemoveAttachment={removeAttachment}
              onSend={handleSendMessage}
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              isDragActive={isDragActive}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                No conversation selected
              </h3>
              <p>Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <Flag className="h-4 w-4" />
              <AlertDescription>
                Are you sure you want to report this message for inappropriate
                content? This action will notify our moderators.
              </AlertDescription>
            </Alert>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowReportDialog(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmReportMessage}>
                Report Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sub-components
function ConversationItem({
  conversation,
  isSelected,
  onClick,
}: {
  conversation: ConversationWithUser;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={cn(
        "p-3 rounded-lg cursor-pointer transition-colors",
        isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted",
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={conversation.otherUser.profileImage} />
          <AvatarFallback>
            {conversation.otherUser.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-medium truncate">
              {conversation.otherUser.name}
            </h4>
            {conversation.unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {conversation.unreadCount}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {conversation.lastMessage?.content || "No messages yet"}
          </p>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  isOwn,
  onReport,
}: {
  message: Message;
  isOwn: boolean;
  onReport: () => void;
}) {
  return (
    <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[70%] rounded-lg px-3 py-2 relative group",
          isOwn ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <p className="text-sm">{message.content}</p>
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                {message.attachments.map((attachment) => (
                  <AttachmentPreview
                    key={attachment.id}
                    attachment={attachment}
                  />
                ))}
              </div>
            )}
          </div>
          {!isOwn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={onReport}>
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <p className="text-xs opacity-70 mt-1">
          {formatMessageTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

function AttachmentPreview({ attachment }: { attachment: Attachment }) {
  const isImage = attachment.type.startsWith("image/");

  return (
    <div className="flex items-center gap-2 p-2 bg-background/10 rounded">
      {isImage ? (
        <Image className="h-4 w-4" />
      ) : (
        <Paperclip className="h-4 w-4" />
      )}
      <span className="text-xs truncate">{attachment.name}</span>
    </div>
  );
}

function MessageInput({
  value,
  onChange,
  attachments,
  onRemoveAttachment,
  onSend,
  getRootProps,
  getInputProps,
  isDragActive,
}: {
  value: string;
  onChange: (value: string) => void;
  attachments: File[];
  onRemoveAttachment: (index: number) => void;
  onSend: () => void;
  getRootProps: any;
  getInputProps: any;
  isDragActive: boolean;
}) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-4 border-t space-y-3">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-muted px-3 py-1 rounded-lg text-sm"
            >
              <Paperclip className="h-3 w-3" />
              <span className="truncate max-w-32">{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => onRemoveAttachment(index)}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div
        className={cn(
          "flex items-end gap-2 p-2 border rounded-lg transition-colors",
          isDragActive && "border-primary bg-primary/5",
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="flex-1">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="min-h-[40px] resize-none border-0 focus-visible:ring-0 shadow-none"
            rows={1}
          />
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm">
            <Smile className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            onClick={onSend}
            disabled={!value.trim() && attachments.length === 0}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function formatMessageTime(date: string) {
  const messageDate = new Date(date);
  if (isToday(messageDate)) {
    return format(messageDate, "HH:mm");
  } else if (isYesterday(messageDate)) {
    return "Yesterday " + format(messageDate, "HH:mm");
  } else {
    return format(messageDate, "MMM d, HH:mm");
  }
}

export default MessageCenter;
