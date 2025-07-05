import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getMessagesByConversationId } from "../../../services/api/Chat/chatservice";
import { useSocket } from "../../../contexts/SocketContext";
import { useAuthContext } from "../../../contexts/AuthContext";

export default function ChatPage() {
  const { conversationId } = useParams();
  const { user } = useAuthContext();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!conversationId) return;
    getMessagesByConversationId(conversationId).then(setMessages);
  }, [conversationId]);

  useEffect(() => {
    if (!socket || !conversationId) return;
    const handleNewMessage = (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on("new_message", handleNewMessage);
    return () => socket.off("new_message", handleNewMessage);
  }, [socket, conversationId]);

  const handleSend = () => {
    if (!input.trim() || !socket) return;
    socket.emit("send_message", {
      conversationId,
      content: input,
      messageType: "text",
    });
    setInput("");
    setMessages((prev) => [
      ...prev,
      {
        _id: Date.now().toString(),
        conversationId,
        senderId: user,
        content: input,
        messageType: "text",
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-[70vh]">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`mb-2 flex ${msg.senderId._id === user._id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-3 py-2 rounded-lg text-sm ${
                msg.senderId._id === user._id
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