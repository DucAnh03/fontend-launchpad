import React, { useEffect, useState } from "react";
import { getConversations } from "@/services/api/Chat/chatservice";

export default function ConversationListBox({ visible, onClose, onSelect, anchorRef }) {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      getConversations().then(data => {
        setConversations(data);
        setLoading(false);
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col z-50"
      style={{ minWidth: 320 }}
      ref={anchorRef}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <span className="font-semibold text-gray-800">Cuộc trò chuyện</span>
        <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-xl font-bold">×</button>
      </div>
      <div className="flex-1 overflow-y-auto" style={{ maxHeight: 350 }}>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="loader border-4 border-gray-200 border-t-blue-500 rounded-full w-8 h-8 animate-spin"></div>
          </div>
        ) : (
          conversations.length === 0 ? (
            <div className="text-center text-gray-500 py-8">Không có cuộc trò chuyện nào</div>
          ) : (
            conversations.map(conv => {
              const other = conv.participants.find(p => p._id !== (conv.me?._id || ""));
              return (
                <div
                  key={conv._id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition"
                  onClick={() => onSelect(conv)}
                >
                  {other?.avatar?.url ? (
                    <img
                      src={other.avatar.url}
                      alt={other.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-white">
                      {other?.name?.[0] || "?"}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold">{other?.name || "Người dùng"}</div>
                    <div className="text-xs text-gray-500 truncate" style={{ maxWidth: 160 }}>
                      {conv.lastMessage?.content || "Chưa có tin nhắn"}
                    </div>
                  </div>
                </div>
              );
            })
          )
        )}
      </div>
    </div>
  );
}