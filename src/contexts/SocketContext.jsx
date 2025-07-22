// src/contexts/SocketContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react"; // Thêm useRef
import { io } from "socket.io-client";
import { useAuthContext } from "./AuthContext";
import { message } from "antd";

const SocketContext = createContext({
  socket: null,
  unreadCount: 0,
  clearNotifications: () => {},
  onReceiveMessage: (callback) => {}, // Thêm hàm đăng ký callback
  offReceiveMessage: (callback) => {}, // Thêm hàm hủy đăng ký callback
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [unreadConversations, setUnreadConversations] = useState(new Set());
  const { user } = useAuthContext();

  // Dùng useRef để lưu trữ callbacks, tránh re-render khi callbacks thay đổi
  const receiveMessageCallbacks = useRef(new Set());

  // Hàm để các component đăng ký lắng nghe tin nhắn mới
  const onReceiveMessage = (callback) => {
    receiveMessageCallbacks.current.add(callback);
  };

  // Hàm để các component hủy đăng ký
  const offReceiveMessage = (callback) => {
    receiveMessageCallbacks.current.delete(callback);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (user && token) {
      const newSocket = io("http://localhost:5000", {
        // URL backend
        extraHeaders: {
          authorization: `Bearer ${token}`,
        },
        cors: {
          origin: "http://localhost:3000", // Frontend origin
          credentials: true,
        },
      });

      newSocket.on("connect", () => {
        console.log("✅ Socket.IO đã kết nối");
        setSocket(newSocket);
      });

      newSocket.on("receiveMessage", (messageData) => {
        console.log(
          "✅ [SocketContext] Đã nhận 'receiveMessage':",
          messageData
        );
        // Gọi tất cả các callbacks đã đăng ký
        receiveMessageCallbacks.current.forEach((callback) =>
          callback(messageData)
        );

        // Cập nhật lastMessage cho conversation nếu messageData có đủ thông tin
        // Logic này có thể phức tạp nếu bạn muốn cập nhật toàn bộ conversation object
        // Một cách đơn giản là chỉ cập nhật notification count ở đây,
        // và để ChatWindow tự hiển thị tin nhắn.
        // Hoặc bạn có thể thêm logic để dispatch một action global (nếu dùng Redux/Zustand)
        // để cập nhật trạng thái cuộc trò chuyện.
      });

      newSocket.on("new_message_notification", (notification) => {
        console.log(
          "✅ [SocketContext] Đã nhận sự kiện 'new_message_notification':",
          notification
        );

        if (
          notification &&
          notification.senderName &&
          notification.conversationId
        ) {
          message.info(`Bạn có tin nhắn mới từ ${notification.senderName}`);
          setUnreadConversations((prevUnread) => {
            const newUnreadSet = new Set(prevUnread);
            newUnreadSet.add(notification.conversationId);
            console.log(
              "   => Tổng số cuộc trò chuyện chưa đọc:",
              newUnreadSet.size
            );
            return newUnreadSet;
          });
        }
      });

      newSocket.on("sendMessage_error", (error) => {
        console.error("❌ [SocketContext] Lỗi gửi tin nhắn:", error.message);
        message.error(`Lỗi gửi tin nhắn: ${error.message}`);
      });

      newSocket.on("disconnect", () => {
        console.log("❌ Socket.IO đã ngắt kết nối");
        setSocket(null);
      });

      newSocket.on("connect_error", (err) => {
        console.error("❌ Socket.IO Connection Error:", err.message);
        message.error(`Lỗi kết nối WebSocket: ${err.message}`);
      });

      return () => {
        newSocket.disconnect();
      };
    } else if (!user && socket) {
      socket.disconnect();
      setSocket(null);
    }
  }, [user]);

  const clearNotifications = () => {
    setUnreadConversations(new Set());
  };

  const value = {
    socket,
    unreadCount: unreadConversations.size,
    clearNotifications,
    onReceiveMessage, // Thêm vào context value
    offReceiveMessage, // Thêm vào context value
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
