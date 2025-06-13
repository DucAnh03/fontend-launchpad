import React, { useState } from "react";
import { Card, Row, Col, Statistic, Button } from "antd";
import { DashboardOutlined } from "@ant-design/icons";

export default function DashboardBar() {
    const [visible, setVisible] = useState(true);

    if (!visible) {
        return (
            <Button
                type="text"
                icon={<DashboardOutlined />}
                onClick={() => setVisible(true)}
                style={{ margin: '16px 0', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}
            >
                Hiện Dashboard
            </Button>
        );
    }

    return (
        <div style={{ padding: '16px 24px', background: '#fff', position: 'relative', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', color: '#222' }}>
            <Button
                type="text"
                icon={<DashboardOutlined />}
                onClick={() => setVisible(false)}
                style={{ position: 'absolute', right: 24, top: 16, zIndex: 1 }}
            >
                Ẩn Dashboard
            </Button>
            <Row gutter={16}>
                <Col span={6}>
                    <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderRadius: 8 }}>
                        <Statistic title="Tổng số dự án" value={5} valueStyle={{ color: '#222' }} titleStyle={{ color: '#555' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderRadius: 8 }}>
                        <Statistic title="Tasks đang thực hiện" value={8} valueStyle={{ color: '#222' }} titleStyle={{ color: '#555' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderRadius: 8 }}>
                        <Statistic title="Tin nhắn chưa đọc" value={3} valueStyle={{ color: '#222' }} titleStyle={{ color: '#555' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderRadius: 8 }}>
                        <Statistic title="Hiệu suất" value={85} suffix="%" valueStyle={{ color: '#222' }} titleStyle={{ color: '#555' }} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
} 