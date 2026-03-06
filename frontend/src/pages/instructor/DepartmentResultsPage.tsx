import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import Layout from '../../components/Layout';

interface StudentResult {
  student: { user_id: number; student_id_no: string; first_name: string; last_name: string; major: { name: string } };
  gpa: number;
}

export default function DepartmentResultsPage() {
  const [results, setResults] = useState<StudentResult[]>([]);

  useEffect(() => {
    api.get('/grades/department').then((r) => setResults(r.data));
  }, []);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">ผลการเรียนนักศึกษาในภาควิชา</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left">รหัสนักศึกษา</th>
                <th className="px-4 py-3 text-left">ชื่อ-สกุล</th>
                <th className="px-4 py-3 text-left">สาขา</th>
                <th className="px-4 py-3 text-center">GPA</th>
                <th className="px-4 py-3 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.student.user_id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{r.student.student_id_no}</td>
                  <td className="px-4 py-3">{r.student.first_name} {r.student.last_name}</td>
                  <td className="px-4 py-3">{r.student.major?.name}</td>
                  <td className="px-4 py-3 text-center font-semibold text-blue-700">{r.gpa.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <Link to={`/instructor/students/${r.student.user_id}`} className="text-blue-700 hover:underline text-xs">
                      ดูรายละเอียด
                    </Link>
                  </td>
                </tr>
              ))}
              {!results.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-400">ไม่มีข้อมูล</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
  </Layout>
  );
}
