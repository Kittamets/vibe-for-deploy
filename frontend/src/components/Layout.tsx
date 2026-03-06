import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = {
  student: [
    { to: '/student/grades', label: 'ผลการเรียน', icon: '📊' },
    { to: '/student/schedule', label: 'ตารางเรียน', icon: '📅' },
    { to: '/student/exams', label: 'ตารางสอบ', icon: '📝' },
    { to: '/student/register', label: 'ลงทะเบียนวิชา', icon: '✏️' },
  ],
  instructor: [
    { to: '/instructor/courses', label: 'วิชาที่สอน', icon: '📚' },
    { to: '/instructor/department', label: 'ผลการเรียนในภาควิชา', icon: '🏫' },
  ],
  staff: [
    { to: '/staff/schedule', label: 'จัดการตารางเรียน', icon: '🗓️' },
    { to: '/staff/exams', label: 'จัดการตารางสอบ', icon: '📋' },
    { to: '/staff/faculty-results', label: 'ผลการเรียนประจำคณะ', icon: '🎓' },
  ],
};

const ROLE_LABEL = { student: 'นักศึกษา', instructor: 'อาจารย์', staff: 'เจ้าหน้าที่' };

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = user ? NAV_ITEMS[user.role] : [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-blue-800 text-white flex flex-col">
        <div className="px-5 py-6 border-b border-blue-700">
          <p className="text-xs text-blue-300 uppercase tracking-wider mb-1">ระบบสำนักทะเบียน</p>
          <p className="font-semibold text-sm truncate">{user?.email}</p>
          <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full mt-1 inline-block">
            {user ? ROLE_LABEL[user.role] : ''}
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-white text-blue-800 font-semibold'
                    : 'text-blue-100 hover:bg-blue-700'
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-blue-100 hover:bg-blue-700 transition-colors"
          >
            <span>🚪</span>
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
