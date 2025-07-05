import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from "socket.io-client";
import { useAuthContext } from "./AuthContext"; // Import AuthContext
import { message } from 'antd'; // Import Ant Design message để tạo thông báo

// Context bây giờ sẽ cung cấp nhiều thông tin hơn
const SocketContext = createContext({
    socket: null,
    unreadCount: 0,
    clearNotifications: () => {},
});

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [unreadConversations, setUnreadConversations] = useState(new Set());
    const { user } = useAuthContext();

    useEffect(() => {
        let newSocket;
        const token = localStorage.getItem('token');
        if (user && token) {
            const newSocket = io("http://localhost:3000", {
                extraHeaders: {
                    authorization: `Bearer ${token}`
                }
            });
            setSocket(newSocket);
            newSocket.on('connect', () => {
                console.log('✅ Socket.IO đã kết nối');
            });

            // --- CẬP NHẬT PHẦN LẮNG NGHE SỰ KIỆN ---
            newSocket.on('new_message_notification', (notification) => {
                // Thêm log để debug: kiểm tra xem client có nhận được sự kiện này không
                console.log("✅ [SocketContext] Đã nhận sự kiện 'new_message_notification':", notification);

                // Kiểm tra xem notification có hợp lệ không
                if (notification && notification.senderName && notification.conversationId) {
                    // Hiển thị một pop-up thông báo nhỏ
                    message.info(`Bạn có tin nhắn mới từ ${notification.senderName}`);

                    // Thêm ID của cuộc trò chuyện vào danh sách chưa đọc
                    setUnreadConversations(prevUnread => {
                        const newUnreadSet = new Set(prevUnread);
                        newUnreadSet.add(notification.conversationId);
                        console.log("   => Tổng số cuộc trò chuyện chưa đọc:", newUnreadSet.size);
                        return newUnreadSet;
                    });
                }
            });
        }
        return () => {
            if (newSocket) newSocket.disconnect();
            setSocket(null);
        };
    }, [user]);

    // Hàm để reset số thông báo trên Badge
    const clearNotifications = () => {
        setUnreadConversations(new Set());
    };

    const value = { 
        socket, 
        unreadCount: unreadConversations.size,
        clearNotifications 
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};
