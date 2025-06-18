import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Badge, Dropdown, Avatar, Menu, Button, Drawer, Input, Spin, Empty, Upload, message } from "antd";
import {
  SunOutlined,
  MoonOutlined,
  MessageOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SendOutlined,
  PaperClipOutlined,
  CloseCircleFilled
} from "@ant-design/icons";
import { useSocket } from '@/contexts/SocketContext';
import { useAuthContext } from "@/contexts/AuthContext";
import { getConversations, getMessagesByConversationId, uploadChatFile } from '@/services/api/Chat/chatservice';
import logoLight from "@/assets/logo.png";
import logoDark from "@/assets/logoDark.png";
import * as S from "./Header.styles";

// --- COMPONENT CON 1: NỘI DUNG DROPDOWN TIN NHẮN ---
const MessagesDropdownContent = ({ onConversationSelect }) => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthContext();
    const { socket } = useSocket();
    const navigate = useNavigate();

    const fetchConversations = async () => {
        if (!user) { setLoading(false); return; }
        try {
            const convos = await getConversations();
            setConversations(convos.slice(0, 7));
        } catch (error) { console.error("Lỗi tải tin nhắn cho dropdown:", error); } 
        finally { setLoading(false); }
    };
    
    useEffect(() => {
        fetchConversations();
        if (!socket) return;
        socket.on('receiveMessage', fetchConversations);
        return () => socket.off('receiveMessage', fetchConversations);
    }, [user, socket]);

    if (loading) return <div className="flex justify-center items-center p-4" style={{ width: 350 }}><Spin /></div>;
    if (conversations.length === 0) return <div style={{ width: 350 }}><Empty description="Không có tin nhắn" image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>;

    return (
        <Menu style={{ width: 350 }}>
            <Menu.ItemGroup title="Tin nhắn gần đây">
                {conversations.map(convo => {
                    const otherUser = convo.participants.find(p => p._id !== user._id);
                    return (
                        <Menu.Item key={convo._id} onClick={() => onConversationSelect(convo)} style={{ padding: '10px 12px' }}>
                            <div className="flex items-center gap-3">
                                <Avatar src={otherUser?.avatar?.url} size={40}>{otherUser?.name?.charAt(0)}</Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <div className="font-semibold text-sm">{otherUser?.name}</div>
                                    <div className="text-xs text-gray-500 truncate">{convo.lastMessage?.content || '...'}</div>
                                </div>
                            </div>
                        </Menu.Item>
                    );
                })}
            </Menu.ItemGroup>
            <Menu.Divider />
            <Menu.Item key="all-messages" onClick={() => navigate('/dashboard/messages')}>
                <div className="text-center text-blue-600 font-semibold">Xem tất cả trong Messenger</div>
            </Menu.Item>
        </Menu>
    );
};


// --- COMPONENT CON 2: NỘI DUNG KHUNG CHAT TRONG DRAWER (ĐÃ CẬP NHẬT) ---
const ChatDrawerContent = ({ conversation, socket, user }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [filesToPreview, setFilesToPreview] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    useEffect(() => {
        if (!conversation?._id) return;
        const loadMessages = async () => {
            setLoading(true);
            try {
                const messageHistory = await getMessagesByConversationId(conversation._id);
                setMessages(messageHistory.reverse());
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        loadMessages();
    }, [conversation?._id]);

    useEffect(() => {
        if (!socket) return;
        const handleReceiveMessage = (message) => {
            if (message.conversationId === conversation?._id) {
                setMessages(prev => [...prev, message]);
            }
        };
        socket.on('receiveMessage', handleReceiveMessage);
        return () => socket.off('receiveMessage', handleReceiveMessage);
    }, [socket, conversation?._id]);

    useEffect(scrollToBottom, [messages]);
    
    const handleFileChange = (info) => {
        // Lấy file mới nhất từ danh sách của Antd
        const newFiles = info.fileList.map(file => {
            // Nếu chưa có preview, tạo một cái
            if (!file.preview && file.originFileObj) {
                file.preview = URL.createObjectURL(file.originFileObj);
            }
            return file;
        });
        setFilesToPreview(newFiles);
    };

    const handleRemovePreview = (fileToRemove) => {
        setFilesToPreview(prev => prev.filter(file => file.uid !== fileToRemove.uid));
    };

    // HÀM GỬI TIN NHẮN ĐÃ ĐƯỢC TỐI ƯU
    const handleSendMessage = async (e) => {
        e.preventDefault();
        const hasText = newMessage.trim().length > 0;
        const hasFiles = filesToPreview.length > 0;

        if ((!hasText && !hasFiles) || !socket || !conversation) return;
        
        setIsSending(true);
        const receiver = conversation.participants.find(p => p._id !== user._id);
        if (!receiver) { setIsSending(false); return; }

        try {
            // Bước 1: Upload tất cả file đang chờ
            if (hasFiles) {
                const uploadPromises = filesToPreview.map(fileObj => {
                    const formData = new FormData();
                    formData.append('attachment', fileObj.originFileObj);
                    return uploadChatFile(formData);
                });
                
                const uploadedAttachments = await Promise.all(uploadPromises);
                
                // Bước 2: Gửi từng file đã upload qua socket
                uploadedAttachments.forEach(attachmentData => {
                    socket.emit('sendMessage', {
                        receiverId: receiver._id,
                        conversationId: conversation._id,
                        messageType: attachmentData.resource_type || 'image',
                        attachment: attachmentData,
                    });
                });
            }

            // Bước 3: Gửi tin nhắn văn bản (nếu có)
            if (hasText) {
                socket.emit('sendMessage', {
                    receiverId: receiver._id,
                    content: newMessage,
                    messageType: 'text',
                    conversationId: conversation._id,
                });
            }
            
            // Bước 4: Reset form sau khi tất cả đã được gửi đi
            setNewMessage('');
            setFilesToPreview([]);

        } catch (error) {
            message.error("Gửi file thất bại. Vui lòng thử lại.");
            console.error("Lỗi khi gửi file:", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {loading ? <div className="flex justify-center items-center h-full"><Spin /></div> :
                    messages.map(msg => (
                        <div key={msg._id} className={`mb-2 flex ${msg.senderId._id === user._id ? 'justify-end' : 'justify-start'}`}>
                             <div className={`max-w-xs p-2 rounded-2xl ${msg.senderId._id === user._id ? 'bg-blue-500 text-white' : 'bg-white shadow-sm'}`}>
                                {msg.messageType === 'text' && <p className="px-1 py-1 whitespace-pre-wrap">{msg.content}</p>}
                                
                                {/* SỬA LẠI ĐÂY: Thêm giới hạn chiều cao cho ảnh và video */}
                                {msg.messageType === 'image' && msg.attachment?.secure_url && 
                                    <img 
                                        src={msg.attachment.secure_url} 
                                        alt="Ảnh đã gửi" 
                                        className="rounded-xl max-w-full max-h-80 block cursor-pointer"
                                        onClick={() => window.open(msg.attachment.secure_url, '_blank')}
                                    />
                                }
                                {msg.messageType === 'video' && msg.attachment?.secure_url && 
                                    <video 
                                        src={msg.attachment.secure_url} 
                                        controls 
                                        className="rounded-xl max-w-full max-h-80 block" 
                                    />
                                }
                            </div>
                        </div>
                    ))
                }
                <div ref={messagesEndRef} />
            </div>

            <div className="p-2 bg-white border-t">
                {filesToPreview.length > 0 && (
                    <div className="p-2 mb-2 border rounded-lg bg-gray-50 flex flex-wrap gap-2">
                        {filesToPreview.map(file => (
                            <div key={file.uid} className="relative">
                                <img src={file.preview || file.thumbUrl} alt={file.name} className="w-16 h-16 object-cover rounded-md" />
                                <Button shape="circle" icon={<CloseCircleFilled />} size="small" className="absolute -top-1 -right-1 bg-white" onClick={() => handleRemovePreview(file)} />
                            </div>
                        ))}
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Upload
                        multiple
                        fileList={filesToPreview}
                        onChange={handleFileChange}
                        beforeUpload={() => false} // Ngăn Antd tự upload
                        showUploadList={false}
                    >
                        <Button icon={<PaperClipOutlined />} shape="circle" disabled={isSending}/>
                    </Upload>
                    <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Nhập tin nhắn..." />
                    <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={isSending} />
                </form>
            </div>
        </div>
    );
};


// --- COMPONENT HEADER CHÍNH ---
export default function Header() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { socket, unreadCount, clearNotifications } = useSocket();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);
  const [dark, setDark] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", dark);
    localStorage.setItem("darkMode", String(dark));
  }, [dark]);

  const toggleDarkMode = () => setDark(prev => !prev);
  const handleDropdownOpenChange = (isOpen) => { if (isOpen && unreadCount > 0) clearNotifications(); };
  const handleOpenChatDrawer = (conversation) => {
      setActiveConversation(conversation);
      setIsDrawerVisible(true);
  };
  const handleCloseChatDrawer = () => {
      setIsDrawerVisible(false);
      setActiveConversation(null);
  };
  
  const routes = [
    { label: "Tuyển dụng", path: "/recruitment" },
    { label: "Bảng tin", path: "/posts" },
    { label: "Cộng đồng", path: "/community" },
    { label: "Portfolio", path: "/portfolio" },
  ];

   const profileMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate("/profile")}>Trang cá nhân</Menu.Item>
      <Menu.Item key="dashboard" icon={<UserOutlined />} onClick={() => navigate("/dashboard/messages")}>Dashboard</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout} danger>Đăng xuất</Menu.Item>
    </Menu>
  );

  const themeProp = dark ? "dark" : "light";

  return (
    <>
      <S.HeaderWrapper theme={themeProp}>
        <S.HeaderInner>
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <img src={dark ? logoDark : logoLight} alt="Logo" height={40} style={{ cursor: "pointer" }} onClick={() => navigate("/")}/>
            <S.Nav theme={themeProp}>
              <ul>
                {routes.map(({ label, path }) => (
                  <li key={path}><Link to={path} className={pathname === path ? 'active' : ''}>{label}</Link></li>
                ))}
              </ul>
            </S.Nav>
          </div>

          <S.Actions>
            <Button type="text" shape="circle" icon={dark ? <SunOutlined /> : <MoonOutlined />} onClick={toggleDarkMode} />
            <Dropdown overlay={<MessagesDropdownContent onConversationSelect={handleOpenChatDrawer} />} placement="bottomRight" trigger={['click']} onOpenChange={handleDropdownOpenChange} arrow>
              <a onClick={e => e.preventDefault()} title="Tin nhắn" style={{ cursor: 'pointer' }}>
                <Badge count={unreadCount}><MessageOutlined style={{ fontSize: '20px' }} /></Badge>
              </a>
            </Dropdown>

            <Link to="/notifications" title="Thông báo"><Badge count={5}><BellOutlined style={{ fontSize: '20px' }} /></Badge></Link>

            {user ? (
               <Dropdown overlay={profileMenu} placement="bottomRight" arrow>
                  <Avatar src={user.avatar?.url} icon={!user.avatar?.url && <UserOutlined />} style={{ cursor: 'pointer' }} />
               </Dropdown>
            ) : (
              <Link to="/signin"><Button type="primary">Đăng nhập</Button></Link>
            )}
          </S.Actions>
        </S.HeaderInner>
      </S.HeaderWrapper>
      
      <Drawer
        title={ activeConversation && (
            <div className="flex items-center gap-3">
                <Avatar src={activeConversation.participants.find(p => p._id !== user._id)?.avatar?.url} />
                <span className="font-semibold">{activeConversation.participants.find(p => p._id !== user._id)?.name}</span>
            </div>
        )}
        placement="right"
        onClose={handleCloseChatDrawer}
        open={isDrawerVisible}
        width={378}
        bodyStyle={{ padding: 0 }}
        destroyOnClose
      >
          {activeConversation && <ChatDrawerContent conversation={activeConversation} socket={socket} user={user} />}
      </Drawer>
    </>
  );
}
