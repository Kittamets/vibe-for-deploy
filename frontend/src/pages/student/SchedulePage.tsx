import { useEffect, useState } from 'react';
import api from '../../api/client';
import Layout from '../../components/Layout';

interface ScheduleEntry {
  id: number;
  room: string;
  schedule_json: Record<string, string>;
  course: { code: string; name: string; credits: number };
  semester: { year: number; term: string };
  instructor?: { first_name: string; last_name: string };
}

const DAYS = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'];

export default function SchedulePage() {
  const [sections, setSections] = useState<ScheduleEntry[]>([]);

  useEffect(() => {
    api.get('/enrollments/my').then((r) => {
      setSections(r.data.map((e: { section: ScheduleEntry }) => e.section));
    });
  }, []);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">ตารางเรียน</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left">วิชา</th>
                <th className="px-4 py-3 text-left">ห้อง</th>
                <th className="px-4 py-3 text-left">วัน/เวลา</th>
                <th className="px-4 py-3 text-left">อาจารย์</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{s.course.code}</p>
                    <p className="text-gray-500">{s.course.name}</p>
                  </td>
                  <td className="px-4 py-3">{s.room || '-'}</td>
                  <td className="px-4 py-3">
                    {s.schedule_json
                      ? Object.entries(s.schedule_json).map(([day, time]) => (
                          <p key={day}>{DAYS[+day] || day}: {time}</p>
                        ))
                      : '-'}
                  </td>
                  <td className="px-4 py-3">
                    {s.instructor
                      ? `${s.instructor.first_name} ${s.instructor.last_name}`
                      : '-'}
                  </td>
                </tr>
              ))}
              {!sections.length && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                    ไม่มีข้อมูลตารางเรียน
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
