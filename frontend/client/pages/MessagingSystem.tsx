import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Settings,
  Archive,
  Star,
  Trash2,
  Download,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { messagingService } from "../api/services/messaging.service";
import { Message, Conversation, User, Attachment } from "../types/platform";
import { useAuth } from "../contexts/AuthContext";

interface MessagingSystemProps {}

export const MessagingSystem: React.FC<MessagingSystemProps> = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
    loadUnreadCount();
    updateOnlineStatus();

    // Cleanup on unmount
    return () => {
      messagingService.updateOnlineStatus(false);
    };
  }, []);

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id);
      markConversationAsRead(activeConversation.id);
    }
  }, [activeConversation]);

  // Auto-scroll to bottom when new messages arrive
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

  const loadMessages = async (conversationId: number) => {
    try {
      const response = await messagingService.getMessages(conversationId);
      setMessages(response.messages);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await messagingService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to load unread count:", error);
    }
  };

  const updateOnlineStatus = () => {
    messagingService.updateOnlineStatus(true);
  };

  const markConversationAsRead = async (conversationId: number) => {
    try {
      await messagingService.markAsRead(conversationId);
      setUnreadCount((prev) =>
        Math.max(0, prev - (activeConversation?.unreadCount || 0)),
      );

      // Update conversation in list
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv,
        ),
      );
    } catch (error) {
      console.error("Failed to mark conversation as read:", error);
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

      // Update conversation's last message
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversation.id
            ? {
                ...conv,
                lastMessage: message,
                updatedAt: new Date().toISOString(),
              }
            : conv,
        ),
      );

      scrollToBottom();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleTyping = useCallback(() => {
    if (!activeConversation) return;

    if (!isTyping) {
      setIsTyping(true);
      messagingService.startTyping(activeConversation.id);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      messagingService.stopTyping(activeConversation.id);
    }, 3000);
  }, [activeConversation, isTyping]);

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
    } else {
      handleTyping();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getOtherParticipant = (
    conversation: Conversation,
  ): User | undefined => {
    return conversation.participants.find((p) => p.id !== user?.id);
  };

  const isUserOnline = (userId: number): boolean => {
    return onlineUsers.includes(userId);
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Conversations List */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                  {unreadCount}
                </span>
              )}
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Loading conversations...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No conversations found
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);
              if (!otherParticipant) return null;

              return (
                <div
                  key={conversation.id}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    activeConversation?.id === conversation.id
                      ? "bg-blue-50 border-blue-200"
                      : ""
                  }`}
                  onClick={() => setActiveConversation(conversation)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={
                          otherParticipant.avatar || "/api/placeholder/40/40"
                        }
                        alt={otherParticipant.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {isUserOnline(otherParticipant.id) && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {otherParticipant.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {conversation.lastMessage &&
                            new Date(
                              conversation.lastMessage.timestamp,
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage?.content ||
                            "No messages yet"}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {(() => {
                    const otherParticipant =
                      getOtherParticipant(activeConversation);
                    if (!otherParticipant) return null;

                    return (
                      <>
                        <div className="relative">
                          <img
                            src={
                              otherParticipant.avatar ||
                              "/api/placeholder/40/40"
                            }
                            alt={otherParticipant.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          {isUserOnline(otherParticipant.id) && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <h2 className="text-lg font-medium text-gray-900">
                            {otherParticipant.name}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {isUserOnline(otherParticipant.id)
                              ? "Online"
                              : "Offline"}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isOwn = message.senderId === user?.id;
                const sender = activeConversation.participants.find(
                  (p) => p.id === message.senderId,
                );

                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md ${isOwn ? "order-1" : "order-2"}`}
                    >
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          isOwn
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        {message.attachments &&
                          message.attachments.length > 0 && (
                            <div className="mb-2 space-y-2">
                              {message.attachments.map((attachment, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-2 p-2 bg-white bg-opacity-20 rounded"
                                >
                                  <Paperclip className="w-4 h-4" />
                                  <span className="text-sm truncate">
                                    {attachment.fileName}
                                  </span>
                                  <button className="ml-auto">
                                    <Download className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <p
                        className={`text-xs mt-1 ${isOwn ? "text-right" : "text-left"} text-gray-500`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {isOwn && message.isRead && (
                          <span className="ml-1">✓✓</span>
                        )}
                      </p>
                    </div>

                    {!isOwn && (
                      <img
                        src={sender?.avatar || "/api/placeholder/32/32"}
                        alt={sender?.name}
                        className="w-8 h-8 rounded-full object-cover order-1 mr-2"
                      />
                    )}
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="border-t border-gray-200 p-4">
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <Paperclip className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({formatFileSize(file.size)})
                        </span>
                      </div>
                      <button
                        onClick={() => removeSelectedFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-end space-x-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full max-h-32 min-h-[2.5rem] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={1}
                  />
                </div>

                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <Smile className="w-5 h-5" />
                </button>

                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() && selectedFiles.length === 0}
                  className={`p-2 rounded-lg ${
                    newMessage.trim() || selectedFiles.length > 0
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* No Conversation Selected */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Start a conversation
              </h3>
              <p className="text-gray-500">
                Select a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
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

export default MessagingSystem;
