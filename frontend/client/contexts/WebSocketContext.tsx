import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { Message, User } from "../types/platform";
import { useAuth } from "./AuthContext";

interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: (message: any) => void;
  joinConversation: (conversationId: number) => void;
  leaveConversation: (conversationId: number) => void;
  updateTypingStatus: (conversationId: number, isTyping: boolean) => void;
  onlineUsers: number[];
  typingUsers: Record<number, number[]>; // conversationId -> userIds[]
}

interface WebSocketProviderProps {
  children: React.ReactNode;
}

interface WebSocketMessage {
  type: "message" | "typing" | "user_status" | "conversation_update" | "error";
  data: any;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined,
);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const { user, token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<number, number[]>>({});

  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const heartbeatInterval = useRef<NodeJS.Timeout>();

  // Event listeners for message handling
  const messageListeners = useRef<Map<string, ((data: any) => void)[]>>(
    new Map(),
  );
  const typingTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const getWebSocketUrl = useCallback(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host =
      import.meta.env.VITE_WS_URL || `${protocol}//${window.location.host}`;
    return `${host}/ws`;
  }, []);

  const connect = useCallback(() => {
    if (!user || !token) return;

    try {
      const wsUrl = `${getWebSocketUrl()}?token=${token}&userId=${user.id}`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        reconnectAttempts.current = 0;

        // Start heartbeat
        startHeartbeat();

        // Send initial presence update
        sendMessage({
          type: "user_status",
          data: { isOnline: true },
        });
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.current.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        setIsConnected(false);
        stopHeartbeat();

        // Attempt to reconnect unless it was a deliberate close
        if (
          event.code !== 1000 &&
          reconnectAttempts.current < maxReconnectAttempts
        ) {
          scheduleReconnect();
        }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      scheduleReconnect();
    }
  }, [user, token, getWebSocketUrl]);

  const disconnect = useCallback(() => {
    if (ws.current) {
      // Send offline status before closing
      if (ws.current.readyState === WebSocket.OPEN) {
        sendMessage({
          type: "user_status",
          data: { isOnline: false },
        });
      }

      ws.current.close(1000, "User logout");
      ws.current = null;
    }

    stopHeartbeat();

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    setIsConnected(false);
    setOnlineUsers([]);
    setTypingUsers({});
  }, []);

  const scheduleReconnect = useCallback(() => {
    const delay = Math.min(
      1000 * Math.pow(2, reconnectAttempts.current),
      30000,
    );

    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectAttempts.current++;
      console.log(
        `Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})...`,
      );
      connect();
    }, delay);
  }, [connect]);

  const startHeartbeat = () => {
    heartbeatInterval.current = setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        sendMessage({ type: "ping", data: {} });
      }
    }, 30000); // Send ping every 30 seconds
  };

  const stopHeartbeat = () => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
    }
  };

  const sendMessage = useCallback((message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected");
    }
  }, []);

  const handleMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case "message":
        // Emit to message listeners
        emitToListeners("new_message", message.data);
        break;

      case "typing":
        handleTypingMessage(message.data);
        break;

      case "user_status":
        handleUserStatusMessage(message.data);
        break;

      case "conversation_update":
        emitToListeners("conversation_update", message.data);
        break;

      case "error":
        console.error("WebSocket error message:", message.data);
        emitToListeners("error", message.data);
        break;

      default:
        console.log("Unknown message type:", message.type);
    }
  };

  const handleTypingMessage = (data: any) => {
    const { conversationId, userId, isTyping } = data;

    setTypingUsers((prev) => {
      const current = prev[conversationId] || [];

      if (isTyping) {
        // Add user to typing list
        if (!current.includes(userId)) {
          const updated = { ...prev, [conversationId]: [...current, userId] };

          // Clear typing after 5 seconds
          const timeoutKey = `${conversationId}-${userId}`;
          if (typingTimeouts.current.has(timeoutKey)) {
            clearTimeout(typingTimeouts.current.get(timeoutKey));
          }

          const timeout = setTimeout(() => {
            setTypingUsers((latest) => {
              const latestCurrent = latest[conversationId] || [];
              return {
                ...latest,
                [conversationId]: latestCurrent.filter((id) => id !== userId),
              };
            });
            typingTimeouts.current.delete(timeoutKey);
          }, 5000);

          typingTimeouts.current.set(timeoutKey, timeout);
          return updated;
        }
      } else {
        // Remove user from typing list
        const timeoutKey = `${conversationId}-${userId}`;
        if (typingTimeouts.current.has(timeoutKey)) {
          clearTimeout(typingTimeouts.current.get(timeoutKey));
          typingTimeouts.current.delete(timeoutKey);
        }

        return {
          ...prev,
          [conversationId]: current.filter((id) => id !== userId),
        };
      }

      return prev;
    });
  };

  const handleUserStatusMessage = (data: any) => {
    const { userId, isOnline } = data;

    setOnlineUsers((prev) => {
      if (isOnline) {
        return prev.includes(userId) ? prev : [...prev, userId];
      } else {
        return prev.filter((id) => id !== userId);
      }
    });
  };

  const emitToListeners = (event: string, data: any) => {
    const listeners = messageListeners.current.get(event) || [];
    listeners.forEach((listener) => listener(data));
  };

  const joinConversation = useCallback(
    (conversationId: number) => {
      sendMessage({
        type: "join_conversation",
        data: { conversationId },
      });
    },
    [sendMessage],
  );

  const leaveConversation = useCallback(
    (conversationId: number) => {
      sendMessage({
        type: "leave_conversation",
        data: { conversationId },
      });
    },
    [sendMessage],
  );

  const updateTypingStatus = useCallback(
    (conversationId: number, isTyping: boolean) => {
      sendMessage({
        type: "typing",
        data: { conversationId, isTyping },
      });
    },
    [sendMessage],
  );

  // Effect to handle connection lifecycle
  useEffect(() => {
    if (user && token) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [user, token, connect, disconnect]);

  // Effect to handle page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, reduce activity
        if (ws.current?.readyState === WebSocket.OPEN) {
          sendMessage({
            type: "user_status",
            data: { isOnline: false },
          });
        }
      } else {
        // Page is visible, resume activity
        if (ws.current?.readyState === WebSocket.OPEN) {
          sendMessage({
            type: "user_status",
            data: { isOnline: true },
          });
        } else if (user && token) {
          // Reconnect if needed
          connect();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user, token, connect, sendMessage]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      typingTimeouts.current.forEach((timeout) => clearTimeout(timeout));
      typingTimeouts.current.clear();
    };
  }, []);

  const contextValue: WebSocketContextType = {
    isConnected,
    sendMessage,
    joinConversation,
    leaveConversation,
    updateTypingStatus,
    onlineUsers,
    typingUsers,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to subscribe to WebSocket events
export const useWebSocketEvent = (
  event: string,
  handler: (data: any) => void,
) => {
  const context = useContext(WebSocketContext);

  useEffect(() => {
    if (!context) return;

    const messageListeners = (context as any).messageListeners?.current;
    if (!messageListeners) return;

    const listeners = messageListeners.get(event) || [];
    listeners.push(handler);
    messageListeners.set(event, listeners);

    return () => {
      const currentListeners = messageListeners.get(event) || [];
      const index = currentListeners.indexOf(handler);
      if (index > -1) {
        currentListeners.splice(index, 1);
        messageListeners.set(event, currentListeners);
      }
    };
  }, [event, handler]);
};
