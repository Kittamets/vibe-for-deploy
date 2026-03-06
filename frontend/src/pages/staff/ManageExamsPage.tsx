import { useEffect, useState } from 'react';
import api from '../../api/client';
import Layout from '../../components/Layout';

interface Section { id: number; course: { code: string; name: string }; semester: { year: number; term: string } }
interface ExamEntry { id: number; date: string; start_time: string; end_time: string; room: string; type: string; section: { course: { code: string; name: string } } }

export default function ManageExamsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [exams, setExams] = useState<ExamEntry[]>([]);
  const [form, setForm] = useState({ section_id: '', date: '', start_time: '', end_time: '', room: '', type: 'midterm' });
  const [msg, setMsg] = useState('');

  const loadExams = () => {
    // load all exams by fetching sections and aggregating (simplified: fetch all sections and show forms)
    api.get('/sections').then((r) => setSections(r.data));
  };

  useEffect(() => { loadExams(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/exam-schedules', {
        section_id: +form.section_id,
        date: form.date,
        start_time: form.start_time,
        end_time: form.end_time,
        room: form.room,
        type: form.type,
      });
      setMsg('บันทึกตารางสอบสำเร็จ');
      setForm({ section_id: '', date: '', start_time: '', end_time: '', room: '', type: 'midterm' });
    } catch {
      setMsg('เกิดข้อผิดพลาด');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">จัดการตารางสอบ</h2>
        <form onSubmit={handleCreate} className="bg-white rounded-xl shadow p-6 mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Section (วิชา)</label>
            <select required value={form.section_id} onChange={(e) => setForm((f) => ({ ...f, section_id: e.target.value }))} className="w-full border rounded px-3 py-2">
              <option value="">-- เลือก --</option>
              {sections.map((s) => <option key={s.id} value={s.id}>{s.course.code} – {s.semester.year}/{s.semester.term}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ประเภทสอบ</label>
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="w-full border rounded px-3 py-2">
              <option value="midterm">กลางภาค</option>
              <option value="final">ปลายภาค</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">วันที่</label>
            <input type="date" required value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ห้องสอบ</label>
            <input value={form.room} onChange={(e) => setForm((f) => ({ ...f, room: e.target.value }))} className="w-full border rounded px-3 py-2" placeholder="ห้องสอบ" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">เวลาเริ่ม</label>
            <input type="time" required value={form.start_time} onChange={(e) => setForm((f) => ({ ...f, start_time: e.target.value }))} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">เวลาสิ้นสุด</label>
            <input type="time" required value={form.end_time} onChange={(e) => setForm((f) => ({ ...f, end_time: e.target.value }))} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="col-span-2">
            <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded font-medium hover:bg-blue-800">
              บันทึกตารางสอบ
            </button>
            {msg && <span className="ml-4 text-green-600 text-sm">{msg}</span>}
          </div>
        </form>
      </div>
  </Layout>
  );
}
