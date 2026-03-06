import { useEffect, useState } from 'react';
import api from '../../api/client';
import Layout from '../../components/Layout';

interface Section {
  id: number;
  room: string;
  max_students: number;
  course: { code: string; name: string };
  semester: { year: number; term: string };
  instructor?: { first_name: string; last_name: string };
}

interface Course { id: number; code: string; name: string }
interface Semester { id: number; year: number; term: string }
interface Instructor { id: number; first_name: string; last_name: string }

export default function ManageSchedulePage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [form, setForm] = useState({ course_id: '', semester_id: '', instructor_id: '', max_students: '30', room: '' });
  const [msg, setMsg] = useState('');

  const load = () => api.get('/sections').then((r) => setSections(r.data));

  useEffect(() => {
    load();
    api.get('/courses').then((r) => setCourses(r.data));
    api.get('/semesters').then((r) => setSemesters(r.data));
    api.get('/users').then((r) => {
      setInstructors(r.data.filter((u: any) => u.role === 'instructor').map((u: any) => ({ id: u.id, ...u.instructorProfile })));
    });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/sections', {
        course_id: +form.course_id,
        semester_id: +form.semester_id,
        instructor_id: form.instructor_id ? +form.instructor_id : undefined,
        max_students: +form.max_students,
        room: form.room,
      });
      setMsg('เพิ่มตารางเรียนสำเร็จ');
      setForm({ course_id: '', semester_id: '', instructor_id: '', max_students: '30', room: '' });
      load();
    } catch {
      setMsg('เกิดข้อผิดพลาด');
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">จัดการตารางเรียน</h2>

        <form onSubmit={handleCreate} className="bg-white rounded-xl shadow p-6 mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">วิชา</label>
            <select required value={form.course_id} onChange={(e) => setForm((f) => ({ ...f, course_id: e.target.value }))} className="w-full border rounded px-3 py-2">
              <option value="">-- เลือกวิชา --</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.code} – {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ภาคการศึกษา</label>
            <select required value={form.semester_id} onChange={(e) => setForm((f) => ({ ...f, semester_id: e.target.value }))} className="w-full border rounded px-3 py-2">
              <option value="">-- เลือกภาค --</option>
              {semesters.map((s) => <option key={s.id} value={s.id}>{s.year}/{s.term}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">อาจารย์</label>
            <select value={form.instructor_id} onChange={(e) => setForm((f) => ({ ...f, instructor_id: e.target.value }))} className="w-full border rounded px-3 py-2">
              <option value="">-- ไม่ระบุ --</option>
              {instructors.map((i) => <option key={i.id} value={i.id}>{i.first_name} {i.last_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ห้อง</label>
            <input value={form.room} onChange={(e) => setForm((f) => ({ ...f, room: e.target.value }))} className="w-full border rounded px-3 py-2" placeholder="ห้อง" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">จำนวนนักศึกษา (สูงสุด)</label>
            <input type="number" value={form.max_students} onChange={(e) => setForm((f) => ({ ...f, max_students: e.target.value }))} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded font-medium hover:bg-blue-800">
              เพิ่มตารางเรียน
            </button>
          </div>
          {msg && <p className="col-span-2 text-green-600 text-sm">{msg}</p>}
        </form>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left">วิชา</th>
                <th className="px-4 py-3 text-center">ภาค</th>
                <th className="px-4 py-3 text-left">ห้อง</th>
                <th className="px-4 py-3 text-left">อาจารย์</th>
                <th className="px-4 py-3 text-center">ที่นั่ง</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{s.course.code} – {s.course.name}</td>
                  <td className="px-4 py-3 text-center">{s.semester.year}/{s.semester.term}</td>
                  <td className="px-4 py-3">{s.room || '-'}</td>
                  <td className="px-4 py-3">{s.instructor ? `${s.instructor.first_name} ${s.instructor.last_name}` : '-'}</td>
                  <td className="px-4 py-3 text-center">{s.max_students}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  </Layout>
  );
}
