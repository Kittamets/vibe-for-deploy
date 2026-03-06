import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import Layout from '../../components/Layout';

interface Section {
  id: number;
  room: string;
  max_students: number;
  course: { code: string; name: string; credits: number };
  semester: { year: number; term: string };
}

export default function CoursesPage() {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    api.get('/sections/mine').then((r) => setSections(r.data));
  }, []);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">วิชาที่สอน</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left">รหัสวิชา</th>
                <th className="px-4 py-3 text-left">ชื่อวิชา</th>
                <th className="px-4 py-3 text-center">หน่วยกิต</th>
                <th className="px-4 py-3 text-center">ภาค</th>
                <th className="px-4 py-3 text-center">ห้อง</th>
                <th className="px-4 py-3 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {sections.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{s.course.code}</td>
                  <td className="px-4 py-3">{s.course.name}</td>
                  <td className="px-4 py-3 text-center">{s.course.credits}</td>
                  <td className="px-4 py-3 text-center">{s.semester.year}/{s.semester.term}</td>
                  <td className="px-4 py-3 text-center">{s.room || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <Link
                      to={`/instructor/courses/${s.id}/students`}
                      className="text-blue-700 hover:underline text-xs font-medium"
                    >
                      รายชื่อ/เกรด
                    </Link>
                  </td>
                </tr>
              ))}
              {!sections.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                    ไม่มีวิชาที่สอน
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
