import { useEffect, useState } from 'react';
import api from '../../api/client';
import Layout from '../../components/Layout';

interface ExamEntry {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  room: string;
  type: 'midterm' | 'final';
  section: { course: { code: string; name: string } };
}

const typeLabel = { midterm: 'กลางภาค', final: 'ปลายภาค' };

export default function ExamsPage() {
  const [exams, setExams] = useState<ExamEntry[]>([]);

  useEffect(() => {
    api.get('/exam-schedules/my').then((r) => setExams(r.data));
  }, []);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">ตารางสอบ</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left">วิชา</th>
                <th className="px-4 py-3 text-center">ประเภท</th>
                <th className="px-4 py-3 text-center">วันที่</th>
                <th className="px-4 py-3 text-center">เวลา</th>
                <th className="px-4 py-3 text-center">ห้องสอบ</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((e) => (
                <tr key={e.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{e.section.course.code}</p>
                    <p className="text-gray-500">{e.section.course.name}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${e.type === 'midterm' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {typeLabel[e.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">{e.date}</td>
                  <td className="px-4 py-3 text-center">{e.start_time} – {e.end_time}</td>
                  <td className="px-4 py-3 text-center">{e.room || '-'}</td>
                </tr>
              ))}
              {!exams.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                    ไม่มีข้อมูลตารางสอบ
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
