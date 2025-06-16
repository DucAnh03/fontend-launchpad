import React from 'react';
import { Card } from 'antd';

export default function PerformancePage() {
    return (
        <div className="p-4">
            <Card
                title="Hiệu suất"
                className="shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300"
                headStyle={{ fontSize: '1.25rem', fontWeight: 'bold', borderBottom: '2px solid #f0f0f0' }}
            >
                <p className="text-gray-700 leading-relaxed">Thống kê hiệu suất làm việc của bạn sẽ hiển thị ở đây</p>
            </Card>
        </div>
    );
} 