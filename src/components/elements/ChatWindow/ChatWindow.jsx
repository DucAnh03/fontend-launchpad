// ChatWindow.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Card, Avatar, Input, Button, Typography, Spin } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useSocket } from "@/contexts/SocketContext";
import { useAuthContext } from "@/contexts/AuthContext";

const { Text } = Typography;
const { TextArea } = Input;

export default function ChatWindow({ conv, onClose }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket();
  const { user } = useAuthContext();
  const messagesEndRef = useRef(null);

  const receiver = conv.participants.find((p) => p._id !== user.id);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/messages/${conv.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(
          res.data.data.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          )
        );
      } catch (error) {
        console.error("Lỗi khi tải tin nhắn cũ:", error);
      } finally {
        setLoading(false);
      }
    };
    if (conv?.id) fetchMessages();
  }, [conv?.id]);

  useEffect(() => {
    if (socket && conv?.id) {
      const handleReceiveMessage = (newMessage) => {
        if (newMessage.conversationId === conv.id) {
          setMessages((prevMessages) => {
            const isOwnMessage = newMessage.senderId._id === user.id;
            if (isOwnMessage) {
              const existingIndex = prevMessages.findIndex(
                (m) => m.fromMe && m.content === newMessage.content
              );
              if (existingIndex !== -1) {
                const updated = [...prevMessages];
                updated[existingIndex] = newMessage;
                return updated;
              }
            }
            return [...prevMessages, newMessage];
          });
        }
      };

      socket.on("receiveMessage", handleReceiveMessage);
      return () => socket.off("receiveMessage", handleReceiveMessage);
    }
  }, [socket, conv?.id, user.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = msg.trim();
    if (!trimmed || !receiver) return;
    if (!socket) {
      alert("Không thể kết nối đến máy chủ.");
      return;
    }

    const tempId = Date.now().toString();
    const tempMessage = {
      _id: tempId,
      conversationId: conv.id,
      senderId: { _id: user.id, name: user.name },
      content: trimmed,
      createdAt: new Date().toISOString(),
      fromMe: true,
      isTemporary: true,
      tempId,
    };

    setMessages((prev) => [...prev, tempMessage]);

    socket.emit("send_private_message", {
      receiverId: receiver._id,
      content: trimmed,
      messageType: "text",
      tempId,
    });

    setMsg("");
  };

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Avatar src={conv.avatar || receiver?.avatar?.url} />
          <span>{conv.name || receiver?.name}</span>
        </div>
      }
      extra={<Button type="text" icon={<CloseOutlined />} onClick={onClose} />}
      className="w-80 rounded-xl shadow-xl"
      // Vấn đề chính: bodyStyle. Height của Card body bao gồm cả padding mặc định
      // của form gửi tin nhắn.
      // Chúng ta cần một height động hơn hoặc tính toán chính xác hơn.
      // Loại bỏ padding top/bottom mặc định của Card body và quản lý padding bằng flexbox items
      bodyStyle={{
        padding: 0,
        display: "flex",
        flexDirection: "column",
        height: 400,
      }}
    >
      {/* Vùng hiển thị tin nhắn - Đảm bảo nó chiếm đủ không gian còn lại */}
      {/* Loại bỏ `maxHeight` cố định, `flex-1` sẽ giúp nó mở rộng */}
      <div
        className="flex-1 overflow-y-auto px-3 py-2"
        style={
          {
            /* maxHeight: 280 (remove this) */
          }
        }
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spin />
          </div>
        ) : (
          messages.map((m, idx) => {
            const isOwn = m.fromMe || m.senderId?._id === user.id;
            return (
              <div
                key={m._id || m.tempId || idx}
                style={{
                  display: "flex",
                  justifyContent: isOwn ? "flex-end" : "flex-start",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    background: isOwn ? "#ffadd2" : "#f0f0f0",
                    padding: "6px 12px",
                    borderRadius: 12,
                    maxWidth: "75%",
                  }}
                >
                  <Text>{m.content}</Text>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Form nhập tin nhắn */}
      {/* Ant Design Input.TextArea có padding mặc định bên trong */}
      {/* Form này đã có `p-2 border-t`, điều này có thể tạo ra khoảng trống */}
      <form onSubmit={handleSend} className="p-2 border-t">
        <div className="flex gap-2">
          <TextArea
            autoSize={{ minRows: 1, maxRows: 3 }}
            placeholder="Nhập tin nhắn..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault(); // Ngăn xuống dòng
                handleSend(e);
              }
            }}
            className="flex-1"
            style={{ resize: "none" }} // Ngăn chặn người dùng thay đổi kích thước thủ công
          />
          <Button type="primary" htmlType="submit" disabled={!msg.trim()}>
            Gửi
          </Button>
        </div>
      </form>
    </Card>
  );
}
