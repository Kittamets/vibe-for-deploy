import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import Layout from '../../components/Layout';

interface Faculty { id: number; name: string; code: string }
interface StudentResult {
  student: { user_id: number; student_id_no: string; first_name: string; last_name: string; major: { name: string } };
  gpa: number;
}

export default function FacultyResultsPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [results, setResults] = useState<StudentResult[]>([]);

  useEffect(() => {
    api.get('/faculties').then((r) => setFaculties(r.data));
  }, []);

  const search = () => {
    if (!selectedFaculty) return;
    api.get(`/grades/faculty/${selectedFaculty}`).then((r) => setResults(r.data));
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">ผลการเรียนนักศึกษาประจำคณะ</h2>

        <div className="flex gap-3 mb-6">
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
          >
            <option value="">-- เลือกคณะ --</option>
            {faculties.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
          <button onClick={search} className="bg-blue-700 text-white px-6 py-2 rounded font-medium hover:bg-blue-800">
            ค้นหา
          </button>
        </div>

        {results.length > 0 && (
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
                        รายละเอียด
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
  </Layout>
  );
}
