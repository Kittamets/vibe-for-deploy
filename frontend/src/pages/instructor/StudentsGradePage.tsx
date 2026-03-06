import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/client';
import Layout from '../../components/Layout';

const GRADES = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F', 'W', 'I'];

interface Enrollment {
  id: number;
  status: string;
  student: { student_id_no: string; first_name: string; last_name: string };
  grade?: { grade: string };
}

interface SectionDetail {
  id: number;
  course: { code: string; name: string };
  enrollments: Enrollment[];
}

export default function StudentsGradePage() {
  const { id } = useParams<{ id: string }>();
  const [section, setSection] = useState<SectionDetail | null>(null);
  const [gradeMap, setGradeMap] = useState<Record<number, string>>({});
  const [msg, setMsg] = useState('');

  const load = () =>
    api.get(`/sections/${id}/students`).then((r) => {
      setSection(r.data);
      const init: Record<number, string> = {};
      r.data.enrollments.forEach((e: Enrollment) => {
        if (e.grade) init[e.id] = e.grade.grade;
      });
      setGradeMap(init);
    });

  useEffect(() => { load(); }, [id]);

  const save = async (enrollmentId: number) => {
    try {
      await api.post('/grades/record', { enrollment_id: enrollmentId, grade: gradeMap[enrollmentId] });
      setMsg('บันทึกเกรดสำเร็จ');
    } catch {
      setMsg('เกิดข้อผิดพลาด');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-1">รายชื่อนักศึกษา</h2>
        {section && <p className="text-gray-500 mb-4">{section.course.code} – {section.course.name}</p>}
        {msg && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded">{msg}</div>}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left">รหัสนักศึกษา</th>
                <th className="px-4 py-3 text-left">ชื่อ-สกุล</th>
                <th className="px-4 py-3 text-center">เกรด</th>
                <th className="px-4 py-3 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {section?.enrollments.filter((e) => e.status === 'enrolled').map((e) => (
                <tr key={e.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{e.student.student_id_no}</td>
                  <td className="px-4 py-3">{e.student.first_name} {e.student.last_name}</td>
                  <td className="px-4 py-3 text-center">
                    <select
                      value={gradeMap[e.id] || ''}
                      onChange={(ev) => setGradeMap((m) => ({ ...m, [e.id]: ev.target.value }))}
                      className="border rounded px-2 py-1"
                    >
                      <option value="">-- เลือก --</option>
                      {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => save(e.id)}
                      disabled={!gradeMap[e.id]}
                      className="bg-blue-700 text-white px-3 py-1 rounded text-xs hover:bg-blue-800 disabled:opacity-40"
                    >
                      บันทึก
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  </Layout>
  );
}
