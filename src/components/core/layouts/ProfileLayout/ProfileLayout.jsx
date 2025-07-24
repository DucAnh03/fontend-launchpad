import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Button } from 'antd';
import api from '@/services/api/axios';

export default function ProfileLayout() {
    const tabs = [

        // { to: 'recruitment', label: 'Recruitment' },
        { to: 'posts', label: 'Post' },
        { to: 'portfolio', label: 'Portfolio' },
    ];

    return (
        <div className="container mx-auto px-4 py-6 bg-gray-50 min-h-screen">
            {/* Bạn có thể copy-paste phần header avatar/name của Profile vào đây */}
            {/* … */}

            {/* Nav buttons */}

            <div className="flex justify-center gap-4 mb-8">
                {tabs.map(tab => (
                    <NavLink
                        key={tab.to}
                        to={tab.to}
                        end={tab.to === ''}
                        className={({ isActive }) =>
                            isActive
                                ? 'ant-btn ant-btn-primary'
                                : 'ant-btn'
                        }
                    >
                        {tab.label}
                    </NavLink>
                ))}
            </div>
            {/* Outlet sẽ render Overview/Recruitment/Posts/Portfolio */}
            <Outlet />

        </div>
    );
} 