
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import api from '@/services/api/axios';

export default function OAuthCallback() {
    const { setUser } = useAuthContext();      // thêm setter vào context
    const navigate = useNavigate();
    const search = new URLSearchParams(useLocation().search);
    const token = search.get('token');

    useEffect(() => {
        if (!token) return navigate('/signin');
        localStorage.setItem('token', token);

        (async () => {
            try {
                const { data } = await api.get('/users/profile');
                setUser(data.data);
                navigate('/');
            } catch {
                navigate('/signin');
            }
        })();
    }, [token, navigate, setUser]);

    return <p className="text-center mt-20">Đang đăng nhập...</p>;
}
