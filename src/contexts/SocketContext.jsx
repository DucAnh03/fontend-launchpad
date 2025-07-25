// src/contexts/SocketContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { io } from "socket.io-client";
import { useAuthContext } from "./AuthContext";
import { message } from "antd";

const SocketContext = createContext({
  socket: null,
  isConnected: false,
  unreadCount: 0,
  onlineUsers: [],
  
  // Message functions
  sendPrivateMessage: () => {},
  sendGroupMessage: () => {},
  
  // Event listeners
  onReceiveMessage: () => {},
  offReceiveMessage: () => {},
  onMessageNotification: () => {},
  offMessageNotification: () => {},
  onError: () => {},
  offError: () => {},
  
  // Utilities
  clearNotifications: () => {},
  markConversationAsRead: () => {},
  isConversationUnread: () => false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadConversations, setUnreadConversations] = useState(new Set());
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuthContext();

  // Sử dụng useRef để lưu trữ callbacks, tránh re-render
  const receiveMessageCallbacks = useRef(new Set());
  const notificationCallbacks = useRef(new Set());
  const errorCallbacks = useRef(new Set());

  // ===== EVENT LISTENER MANAGEMENT =====
  
  const onReceiveMessage = useCallback((callback) => {
    receiveMessageCallbacks.current.add(callback);
  }, []);

  const offReceiveMessage = useCallback((callback) => {
    receiveMessageCallbacks.current.delete(callback);
  }, []);

  const onMessageNotification = useCallback((callback) => {
    notificationCallbacks.current.add(callback);
  }, []);

  const offMessageNotification = useCallback((callback) => {
    notificationCallbacks.current.delete(callback);
  }, []);

  const onError = useCallback((callback) => {
    errorCallbacks.current.add(callback);
  }, []);

  const offError = useCallback((callback) => {
    errorCallbacks.current.delete(callback);
  }, []);

  // ===== MESSAGE SENDING FUNCTIONS =====
  
  const sendPrivateMessage = useCallback((data) => {
    console.log("🚀 [SocketContext] Gửi tin nhắn riêng tư:", data);
    
    if (socket && isConnected) {
      socket.emit('send_private_message', {
        receiverId: data.receiverId,
        content: data.content,
        messageType: data.messageType || 'text',
        attachment: data.attachment,
        tempId: data.tempId || `temp_${Date.now()}_${Math.random()}`
      });
    } else {
      console.error('❌ Socket chưa kết nối, không thể gửi tin nhắn riêng tư');
      message.error('Không thể gửi tin nhắn. Vui lòng kiểm tra kết nối.');
    }
  }, [socket, isConnected]);

  const sendGroupMessage = useCallback((data) => {
    console.log("🚀 [SocketContext] Gửi tin nhắn nhóm:", data);
    
    if (socket && isConnected) {
      socket.emit('send_group_message', {
        conversationId: data.conversationId,
        content: data.content,
        messageType: data.messageType || 'text',
        attachment: data.attachment,
        tempId: data.tempId || `temp_${Date.now()}_${Math.random()}`
      });
    } else {
      console.error('❌ Socket chưa kết nối, không thể gửi tin nhắn nhóm');
      message.error('Không thể gửi tin nhắn. Vui lòng kiểm tra kết nối.');
    }
  }, [socket, isConnected]);

  // ===== UTILITY FUNCTIONS =====
  
  const clearNotifications = useCallback(() => {
    setUnreadConversations(new Set());
  }, []);

  const markConversationAsRead = useCallback((conversationId) => {
    setUnreadConversations((prevUnread) => {
      const newUnreadSet = new Set(prevUnread);
      newUnreadSet.delete(conversationId);
      return newUnreadSet;
    });
  }, []);

  const isConversationUnread = useCallback((conversationId) => {
    return unreadConversations.has(conversationId);
  }, [unreadConversations]);

  // ===== SOCKET CONNECTION MANAGEMENT =====
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    console.log("🔍 [SocketContext] Debug info:", {
      user: user?.id || user?._id,
      hasToken: !!token,
      tokenLength: token?.length,
      serverUrl: "http://localhost:3000" // Backend port 3000
    });
    
    if (user && token) {
      // Tạo kết nối socket mới - phù hợp với backend socketHandler.js
      const newSocket = io("http://localhost:3000", { // Backend chạy port 3000
        extraHeaders: {
          Authorization: `Bearer ${token}`, // Chú ý: Authorization với A hoa
        },
        auth: {
          token: `Bearer ${token}` // Thêm auth object cho đảm bảo
        },
        cors: {
          origin: "http://localhost:3001", // Frontend có thể chạy port 3001
          credentials: true,
        },
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // ===== CONNECTION EVENTS =====
      
      newSocket.on("connect", () => {
        console.log("✅ Socket.IO đã kết nối với ID:", newSocket.id);
        setSocket(newSocket);
        setIsConnected(true);
      });

      newSocket.on("disconnect", (reason) => {
        console.log("❌ Socket.IO đã ngắt kết nối. Lý do:", reason);
        setSocket(null);
        setIsConnected(false);
        
        // Hiển thị thông báo nếu mất kết nối không mong muốn
        if (reason === 'io server disconnect') {
          message.warning('Kết nối với server đã bị ngắt');
        }
      });

      newSocket.on("connect_error", (err) => {
        console.error("❌ Socket.IO Connection Error:", err.message);
        setIsConnected(false);
        message.error(`Lỗi kết nối: ${err.message}`);
      });

      // ===== ONLINE USERS TRACKING =====
      
      newSocket.on("users_online", (users) => {
        console.log("👥 Danh sách user online:", users);
        setOnlineUsers(users || []);
      });

      newSocket.on("user_online", (userId) => {
        console.log("🟢 User online:", userId);
        setOnlineUsers(prev => [...new Set([...prev, userId])]);
      });

      newSocket.on("user_offline", (userId) => {
        console.log("🔴 User offline:", userId);
        setOnlineUsers(prev => prev.filter(id => id !== userId));
      });

      // ===== MESSAGE EVENTS =====
      
      newSocket.on("receiveMessage", (messageData) => {
        console.log("✅ [SocketContext] Đã nhận 'receiveMessage':", messageData);
        
        // Gọi tất cả các callbacks đã đăng ký
        receiveMessageCallbacks.current.forEach((callback) => {
          try {
            callback(messageData);
          } catch (error) {
            console.error('❌ Lỗi khi xử lý callback receiveMessage:', error);
          }
        });
      });

      newSocket.on("new_message_notification", (notification) => {
        console.log("🔔 [SocketContext] Đã nhận thông báo:", notification);

        if (notification?.senderName && notification?.conversationId) {
          // Hiển thị notification
          const notificationContent = notification.content || 'Tin nhắn mới';
          message.info(`${notification.senderName}: ${notificationContent}`, 3);

          // Cập nhật unread count
          setUnreadConversations((prevUnread) => {
            const newUnreadSet = new Set(prevUnread);
            newUnreadSet.add(notification.conversationId);
            console.log("📊 Tổng cuộc trò chuyện chưa đọc:", newUnreadSet.size);
            return newUnreadSet;
          });

          // Gọi callbacks notification
          notificationCallbacks.current.forEach((callback) => {
            try {
              callback(notification);
            } catch (error) {
              console.error('❌ Lỗi khi xử lý callback notification:', error);
            }
          });
        }
      });

      // ===== ERROR EVENTS =====
      
      newSocket.on("sendMessage_error", (error) => {
        console.error("❌ [SocketContext] Lỗi gửi tin nhắn:", error);
        const errorMessage = error?.message || 'Có lỗi xảy ra khi gửi tin nhắn';
        message.error(`Lỗi: ${errorMessage}`);

        // Gọi callbacks error
        errorCallbacks.current.forEach((callback) => {
          try {
            callback(error);
          } catch (err) {
            console.error('❌ Lỗi khi xử lý callback error:', err);
          }
        });
      });

      // ===== GROUP SPECIFIC EVENTS (có thể thêm sau) =====
      
      newSocket.on("group_member_added", (data) => {
        console.log("👥 Thành viên mới được thêm vào nhóm:", data);
        if (data?.memberName && data?.groupName) {
          message.info(`${data.memberName} đã được thêm vào nhóm ${data.groupName}`);
        }
      });

      newSocket.on("group_member_removed", (data) => {
        console.log("👥 Thành viên bị xóa khỏi nhóm:", data);
        if (data?.memberName && data?.groupName) {
          message.info(`${data.memberName} đã rời khỏi nhóm ${data.groupName}`);
        }
      });

      newSocket.on("group_info_updated", (data) => {
        console.log("📝 Thông tin nhóm được cập nhật:", data);
        if (data?.groupName) {
          message.info(`Thông tin nhóm "${data.groupName}" đã được cập nhật`);
        }
      });

      // Cleanup function
      return () => {
        console.log("🧹 Đang cleanup socket connection...");
        newSocket.disconnect();
        setSocket(null);
        setIsConnected(false);
        setOnlineUsers([]);
      };
      
    } else if (!user && socket) {
      // User đã logout, ngắt kết nối socket
      console.log("👤 User logout, ngắt kết nối socket");
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setUnreadConversations(new Set());
      setOnlineUsers([]);
    }
  }, [user]); // Chỉ depend vào user

  // ===== CONTEXT VALUE =====
  
  const contextValue = {
    socket,
    isConnected,
    unreadCount: unreadConversations.size,
    onlineUsers,
    
    // Message functions
    sendPrivateMessage,
    sendGroupMessage,
    
    // Event listeners
    onReceiveMessage,
    offReceiveMessage,
    onMessageNotification,
    offMessageNotification,
    onError,
    offError,
    
    // Utilities
    clearNotifications,
    markConversationAsRead,
    isConversationUnread,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

// ===== CUSTOM HOOKS =====

// Hook để lắng nghe tin nhắn mới
export const useMessageListener = (callback) => {
  const { onReceiveMessage, offReceiveMessage } = useSocket();

  useEffect(() => {
    if (typeof callback === 'function') {
      onReceiveMessage(callback);
      return () => offReceiveMessage(callback);
    }
  }, [callback, onReceiveMessage, offReceiveMessage]);
};

// Hook để lắng nghe thông báo
export const useNotificationListener = (callback) => {
  const { onMessageNotification, offMessageNotification } = useSocket();

  useEffect(() => {
    if (typeof callback === 'function') {
      onMessageNotification(callback);
      return () => offMessageNotification(callback);
    }
  }, [callback, onMessageNotification, offMessageNotification]);
};

// Hook để lắng nghe lỗi
export const useErrorListener = (callback) => {
  const { onError, offError } = useSocket();

  useEffect(() => {
    if (typeof callback === 'function') {
      onError(callback);
      return () => offError(callback);
    }
  }, [callback, onError, offError]);
};

// Hook để kiểm tra user có online không
export const useUserOnlineStatus = (userId) => {
  const { onlineUsers } = useSocket();
  return onlineUsers.includes(userId);
};

export default SocketContext;