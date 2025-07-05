// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'antd/dist/reset.css';
import './index.css';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import App from './App';
import { StyleProvider } from '@ant-design/cssinjs';
import { SocketProvider } from '@/contexts/SocketContext'; // Import SocketProvider
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider
      // Cho tất cả popup (Select, Dropdown, DatePicker…) mount ra <body> để tránh overflow/z-index issues
      getPopupContainer={() => document.body}
      theme={{ token: { borderRadius: 8 } }}
    >
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider> {/* Wrap with SocketProvider */}
            <StyleProvider hashPriority="high">
              <App />
            </StyleProvider>
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>
);
