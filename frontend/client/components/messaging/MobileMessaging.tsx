import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Search,
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Image,
  FileText,
  Download,
  X,
} from "lucide-react";
import { messagingService } from "../../api/services/messaging.service";
import { Message, Conversation, User } from "../../types/platform";
import { useAuth } from "../../contexts/AuthContext";

interface MobileMessagingProps {
  initialConversationId?: number;
  onBack?: () => void;
}

export const MobileMessaging: React.FC<MobileMessagingProps> = ({
  initialConversationId,
  onBack,
}) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<"conversations" | "chat">(
    "conversations",
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadConversations();

    if (initialConversationId) {
      loadConversationById(initialConversationId);
    }
  }, [initialConversationId]);

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id);
      setCurrentView("chat");
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const response = await messagingService.getConversations(
        1,
        50,
        searchQuery,
      );
      setConversations(response.conversations);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadConversationById = async (conversationId: number) => {
    try {
      const conversation =
        await messagingService.getConversation(conversationId);
      setActiveConversation(conversation);
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  };

  const loadMessages = async (conversationId: number) => {
    try {
      const response = await messagingService.getMessages(conversationId);
      setMessages(response.messages);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const sendMessage = async () => {
    if (
      !activeConversation ||
      (!newMessage.trim() && selectedFiles.length === 0) ||
      !user
    )
      return;

    const otherParticipant = activeConversation.participants.find(
      (p) => p.id !== user.id,
    );
    if (!otherParticipant) return;

    try {
      const message = await messagingService.sendMessage({
        receiverId: otherParticipant.id,
        content: newMessage,
        type: selectedFiles.length > 0 ? "file" : "text",
        attachments: selectedFiles,
      });

      setMessages((prev) => [...prev, message]);
      setNewMessage("");
      setSelectedFiles([]);

      // Auto-resize textarea
      if (messageInputRef.current) {
        messageInputRef.current.style.height = "auto";
      }

      scrollToBottom();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const goBackToConversations = () => {
    setCurrentView("conversations");
    setActiveConversation(null);
    if (onBack) {
      onBack();
    }
  };

  const getOtherParticipant = (
    conversation: Conversation,
  ): User | undefined => {
    return conversation.participants.find((p) => p.id !== user?.id);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isImage = (fileName: string): boolean => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
  };

  const filteredConversations = conversations.filter((conv) => {
    const otherParticipant = getOtherParticipant(conv);
    return (
      otherParticipant?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      conv.lastMessage?.content
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

  // Conversations List View
  if (currentView === "conversations") {
    return (
      <div className="h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Loading conversations...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchQuery ? "No conversations found" : "No messages yet"}
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);
              if (!otherParticipant) return null;

              return (
                <div
                  key={conversation.id}
                  className="p-4 border-b border-gray-100 active:bg-gray-50"
                  onClick={() => setActiveConversation(conversation)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={
                          otherParticipant.avatar || "/api/placeholder/48/48"
                        }
                        alt={otherParticipant.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {otherParticipant.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {conversation.lastMessage &&
                              new Date(
                                conversation.lastMessage.timestamp,
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] text-center">
                              {conversation.unreadCount > 99
                                ? "99+"
                                : conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conversation.lastMessage?.content || "No messages yet"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // Chat View
  if (!activeConversation) return null;

  const otherParticipant = getOtherParticipant(activeConversation);
  if (!otherParticipant) return null;

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={goBackToConversations}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="relative">
              <img
                src={otherParticipant.avatar || "/api/placeholder/40/40"}
                alt={otherParticipant.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {otherParticipant.name}
              </h2>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwn = message.senderId === user?.id;

          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[75%] ${isOwn ? "order-1" : "order-2"}`}>
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    isOwn
                      ? "bg-blue-500 text-white rounded-br-md"
                      : "bg-gray-200 text-gray-900 rounded-bl-md"
                  }`}
                >
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mb-2 space-y-2">
                      {message.attachments.map((attachment, index) => (
                        <div key={index} className="rounded-lg overflow-hidden">
                          {isImage(attachment.fileName) ? (
                            <img
                              src={attachment.url}
                              alt={attachment.fileName}
                              className="w-full h-auto max-h-48 object-cover rounded"
                            />
                          ) : (
                            <div className="flex items-center space-x-2 p-2 bg-white bg-opacity-20 rounded">
                              <FileText className="w-4 h-4" />
                              <span className="text-sm truncate flex-1">
                                {attachment.fileName}
                              </span>
                              <button className="flex-shrink-0">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {message.content && (
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  )}
                </div>
                <p
                  className={`text-xs mt-1 ${isOwn ? "text-right" : "text-left"} text-gray-500`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {isOwn && message.isRead && (
                    <span className="ml-1 text-blue-500">✓✓</span>
                  )}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative flex-shrink-0">
                {isImage(file.name) ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeSelectedFile(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="relative w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-gray-500" />
                    <button
                      onClick={() => removeSelectedFile(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4 safe-area-bottom">
        <div className="flex items-end space-x-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <div className="flex-1 relative">
            <textarea
              ref={messageInputRef}
              value={newMessage}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full min-h-[2.5rem] max-h-[7.5rem] p-3 pr-10 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
              <Smile className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() && selectedFiles.length === 0}
            className={`p-2 rounded-full flex-shrink-0 ${
              newMessage.trim() || selectedFiles.length > 0
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-400"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
      />
    </div>
  );
};

export default MobileMessaging;
