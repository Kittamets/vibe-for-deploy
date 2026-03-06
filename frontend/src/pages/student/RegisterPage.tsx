import { useEffect, useState } from 'react';
import api from '../../api/client';
import Layout from '../../components/Layout';

interface Section {
  id: number;
  max_students: number;
  room: string;
  course: { code: string; name: string; credits: number };
  semester: { year: number; term: string };
  instructor?: { first_name: string; last_name: string };
  _count?: number;
}

export default function RegisterPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [msg, setMsg] = useState('');

  const load = () => api.get('/sections').then((r) => setSections(r.data));
  useEffect(() => { load(); }, []);

  const enroll = async (sectionId: number) => {
    try {
      await api.post('/enrollments', { section_id: sectionId });
      setMsg('ลงทะเบียนสำเร็จ');
      load();
    } catch (e: any) {
      setMsg(e.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">ลงทะเบียนรายวิชา</h2>
        {msg && (
          <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded">
            {msg}
          </div>
        )}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left">รหัสวิชา</th>
                <th className="px-4 py-3 text-left">ชื่อวิชา</th>
                <th className="px-4 py-3 text-center">หน่วยกิต</th>
                <th className="px-4 py-3 text-left">ห้อง</th>
                <th className="px-4 py-3 text-left">อาจารย์</th>
                <th className="px-4 py-3 text-center">ที่นั่ง</th>
                <th className="px-4 py-3 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {sections.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{s.course.code}</td>
                  <td className="px-4 py-3">{s.course.name}</td>
                  <td className="px-4 py-3 text-center">{s.course.credits}</td>
                  <td className="px-4 py-3">{s.room || '-'}</td>
                  <td className="px-4 py-3">
                    {s.instructor ? `${s.instructor.first_name} ${s.instructor.last_name}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">{s.max_students}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => enroll(s.id)}
                      className="bg-blue-700 text-white px-3 py-1 rounded text-xs hover:bg-blue-800"
                    >
                      ลงทะเบียน
                    </button>
                  </td>
                </tr>
              ))}
              {!sections.length && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                    ไม่มีรายวิชาที่เปิดลงทะเบียน
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
  </Layout>
  );
}
