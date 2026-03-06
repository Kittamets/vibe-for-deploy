import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center shadow">
      <span className="font-bold text-lg">ระบบสำนักทะเบียน</span>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm">{user.email}</span>
          <button
            onClick={logout}
            className="bg-white text-blue-700 px-3 py-1 rounded text-sm font-medium hover:bg-blue-50"
          >
            ออกจากระบบ
          </button>
        </div>
      )}
    </nav>
  );
}
