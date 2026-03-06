import { useEffect, useState } from 'react';
import api from '../../api/client';
import Layout from '../../components/Layout';

interface GradeEntry {
  id: number;
  status: string;
  section: {
    course: { code: string; name: string; credits: number };
    semester: { year: number; term: string };
  };
  grade?: { grade: string };
}

export default function GradesPage() {
  const [data, setData] = useState<{ enrollments: GradeEntry[]; gpa: number } | null>(null);

  useEffect(() => {
    api.get('/grades/my').then((r) => setData(r.data));
  }, []);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">ผลการเรียน</h2>
          {data && (
            <span className="text-blue-700 font-semibold text-lg">
              GPA: {data.gpa.toFixed(2)}
            </span>
          )}
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left">รหัสวิชา</th>
                <th className="px-4 py-3 text-left">ชื่อวิชา</th>
                <th className="px-4 py-3 text-center">หน่วยกิต</th>
                <th className="px-4 py-3 text-center">ภาคการศึกษา</th>
                <th className="px-4 py-3 text-center">เกรด</th>
              </tr>
            </thead>
            <tbody>
              {data?.enrollments.map((e) => (
                <tr key={e.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{e.section.course.code}</td>
                  <td className="px-4 py-3">{e.section.course.name}</td>
                  <td className="px-4 py-3 text-center">{e.section.course.credits}</td>
                  <td className="px-4 py-3 text-center">
                    {e.section.semester.year}/{e.section.semester.term}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold">
                    {e.grade?.grade ?? <span className="text-gray-400">-</span>}
                  </td>
                </tr>
              ))}
              {!data?.enrollments.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                    ไม่มีข้อมูลผลการเรียน
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
