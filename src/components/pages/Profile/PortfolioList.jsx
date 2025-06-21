import React, { useEffect, useState } from 'react';
import api from '@/services/api/axios';
import { List, Card, Spin, message } from 'antd';

export default function PortfolioList() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/portfolio/my')
            .then(res => setData(res.data.data))
            .catch(() => message.error('Không load được portfolio'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Spin />;
    return (
        <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={data}
            renderItem={item => (
                <List.Item>
                    <Card title={item.title}>{item.description}</Card>
                </List.Item>
            )}
        />
    );
} 