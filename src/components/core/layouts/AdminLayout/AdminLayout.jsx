import React from 'react';
import { Layout, Menu } from 'antd';
import './AdminLayout.css'; // Ensure you have the correct path to your CSS file
import {
  UserSwitchOutlined,
  BellOutlined,
  BarChartOutlined,
  FileTextOutlined,
  TeamOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import './AdminLayout.css';

const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: 'approve-leader',
    icon: <UserSwitchOutlined />,
    label: 'Approve user become Leader',
  },
  {
    key: 'notification',
    icon: <BellOutlined />,
    label: 'Notification System',
  },
  {
    key: 'statistic',
    icon: <BarChartOutlined />,
    label: 'Statistic System',
  },
  {
    key: 'manage-post',
    icon: <FileTextOutlined />,
    label: 'Manage Post',
  },
  {
    key: 'manage-account',
    icon: <TeamOutlined />,
    label: 'Manage Account',
  },
  {
    key: 'manage-comment',
    icon: <CommentOutlined />,
    label: 'Manage Comment',
  },
];

const AdminLayout = ({ children, onMenuSelect, selectedMenu }) => (
  <Layout style={{ minHeight: '100vh' }}>
    <Sider breakpoint="lg" collapsedWidth="0">
      <div className="admin-logo">
        Admin Panel
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedMenu || 'approve-leader']}
        items={menuItems}
        onClick={({ key }) => onMenuSelect && onMenuSelect(key)}
        style={{ minHeight: '100%' }}
      />
    </Sider>
    <Layout>
      <Header className="admin-header">
        Admin Dashboard
      </Header>
      <Content className="admin-content">
        <div className="admin-content-inner">
          {children}
        </div>
      </Content>
    </Layout>
  </Layout>
);

export default AdminLayout;