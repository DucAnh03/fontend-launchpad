import React, { useEffect, useState } from 'react';
import api from '@/services/api/axios';
import { List, Card, Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

export default function RecruitmentList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/recruitment-posts/')
            .then(res => setData(res.data.data || []))
            .catch(() => {
                message.error('Không load được recruitment');
                setData([]);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Spin />;
    return (
        <>
            <div style={{ textAlign: 'right', marginBottom: 16 }}>
                <Button type="primary" onClick={() => navigate('/recruitment/create')}>
                    Tạo bài đăng
                </Button>
            </div>
            <List
                grid={{ gutter: 16, column: 2 }}
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        <Card title={item.title}>{item.description}</Card>
                    </List.Item>
                )}
            />
        </>
    );
} 