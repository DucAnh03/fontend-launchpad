import React, { useEffect, useRef, useState } from "react";
import { getMessagesByConversationId, startConversation } from "../../../services/api/Chat/chatservice";
import { useSocket } from "../../../contexts/SocketContext";
import { useAuthContext } from "../../../contexts/AuthContext";
import { message as antdMessage } from "antd";

export default function ChatBox({ user, onClose }) {
  const { user: currentUser } = useAuthContext();
  const { socket } = useSocket();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Tự động scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Tìm hoặc tạo cuộc trò chuyện khi mở box chat
  useEffect(() => {
    if (!user || !currentUser) return;
    let ignore = false;
    (async () => {
      try {
        const conv = await startConversation(user._id);
        if (!ignore) {
          setConversation(conv);
          const msgs = await getMessagesByConversationId(conv._id);
          setMessages(msgs);
        }
      } catch (err) {
        antdMessage.error("Không thể tải cuộc trò chuyện!");
      }
    })();
    return () => { ignore = true; };
  }, [user, currentUser]);

  // Lắng nghe tin nhắn mới qua socket
  useEffect(() => {
    if (!socket || !conversation) return;
    const handleNewMessage = (msg) => {
      if (msg.conversationId === conversation._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on("receiveMessage", handleNewMessage);
    return () => socket.off("receiveMessage", handleNewMessage);
  }, [socket, conversation]);

  // Gửi tin nhắn
  const handleSend = () => {
    if (!input.trim() || !conversation || !socket || !socket.connected) return;
    socket.emit("sendMessage", {
      receiverId: user._id,
      content: input,
      messageType: "text",
    });
    setInput("");
  };

  useEffect(() => {
    if (socket) {
      console.log("Socket state in ChatBox:", socket, "Connected:", socket.connected);
    }
  }, [socket]);

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <span className="font-semibold text-gray-800">
          Nhắn tin với {user?.name || "Người dùng"}
        </span>
        <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-xl font-bold">
          ×
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 350 }}>
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`mb-2 flex ${msg.senderId._id === currentUser._id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-3 py-2 rounded-lg text-sm ${
                msg.senderId._id === currentUser._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-2 border-t flex gap-2">
        <input
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none"
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          disabled={!socket}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={handleSend}
          disabled={!input.trim() || !socket}
        >
          Gửi
        </button>
      </div>
    </div>
  );
}