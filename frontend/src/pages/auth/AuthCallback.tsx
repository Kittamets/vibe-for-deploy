import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AuthCallback() {
  const { refresh, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    refresh().then(() => {
      if (user) {
        const paths: Record<string, string> = {
          student: '/student/grades',
          instructor: '/instructor/courses',
          staff: '/staff/schedule',
        };
        navigate(paths[user.role] || '/login');
      } else {
        navigate('/login');
      }
    });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">กำลังเข้าสู่ระบบ...</p>
    </div>
  );
}
