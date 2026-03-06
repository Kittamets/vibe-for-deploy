import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/client';
import Layout from '../../components/Layout';

interface StudentData {
  student: { student_id_no: string; first_name: string; last_name: string; faculty: { name: string }; major: { name: string } };
  enrollments: { id: number; section: { course: { code: string; name: string; credits: number }; semester: { year: number; term: string } }; grade?: { grade: string } }[];
  gpa: number;
}

export default function StudentDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const [data, setData] = useState<StudentData | null>(null);

  useEffect(() => {
    api.get(`/grades/student/${userId}`).then((r) => setData(r.data));
  }, [userId]);

  if (!data) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{data.student.first_name} {data.student.last_name}</h2>
              <p className="text-gray-500">รหัส: {data.student.student_id_no}</p>
              <p className="text-gray-500">คณะ: {data.student.faculty?.name} | สาขา: {data.student.major?.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">GPA</p>
              <p className="text-3xl font-bold text-blue-700">{data.gpa.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left">รหัสวิชา</th>
                <th className="px-4 py-3 text-left">ชื่อวิชา</th>
                <th className="px-4 py-3 text-center">หน่วยกิต</th>
                <th className="px-4 py-3 text-center">ภาค</th>
                <th className="px-4 py-3 text-center">เกรด</th>
              </tr>
            </thead>
            <tbody>
              {data.enrollments.map((e) => (
                <tr key={e.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{e.section.course.code}</td>
                  <td className="px-4 py-3">{e.section.course.name}</td>
                  <td className="px-4 py-3 text-center">{e.section.course.credits}</td>
                  <td className="px-4 py-3 text-center">{e.section.semester.year}/{e.section.semester.term}</td>
                  <td className="px-4 py-3 text-center font-semibold">{e.grade?.grade ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  </Layout>
  );
}
