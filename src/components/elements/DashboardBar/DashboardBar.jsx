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
        <div style={{ padding: '16px 24px', background: 'rgba(141, 32, 32, 0.08)', position: 'relative' }}>
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
                    <Card>
                        <Statistic title="Tổng số dự án" value={5} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Tasks đang thực hiện" value={8} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Tin nhắn chưa đọc" value={3} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Hiệu suất" value={85} suffix="%" />
                    </Card>
                </Col>
            </Row>
        </div>
    );
} 