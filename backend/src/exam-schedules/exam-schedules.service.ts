import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ExamSchedule, ExamType } from '../models/exam-schedule.model';
import { Section } from '../models/section.model';
import { Course } from '../models/course.model';
import { Enrollment } from '../models/enrollment.model';
import { StudentProfile } from '../models/student-profile.model';

@Injectable()
export class ExamSchedulesService {
  constructor(
    @InjectModel(ExamSchedule) private examModel: typeof ExamSchedule,
    @InjectModel(StudentProfile) private studentProfileModel: typeof StudentProfile,
    @InjectModel(Enrollment) private enrollmentModel: typeof Enrollment,
  ) {}

  async getMyExams(userId: number) {
    const student = await this.studentProfileModel.findOne({ where: { user_id: userId } });
    if (!student) throw new NotFoundException('Student profile not found');

    const enrollments = await this.enrollmentModel.findAll({
      where: { student_id: student.id },
      attributes: ['section_id'],
    });
    const sectionIds = enrollments.map((e) => e.section_id);

    return this.examModel.findAll({
      where: { section_id: sectionIds },
      include: [{ model: Section, include: [Course] }],
      order: [['date', 'ASC']],
    });
  }

  create(body: { section_id: number; date: string; start_time: string; end_time: string; room?: string; type: ExamType }) {
    return this.examModel.create(body as any);
  }

  async update(id: number, body: Partial<{ date: string; start_time: string; end_time: string; room: string }>) {
    const exam = await this.examModel.findByPk(id);
    if (!exam) throw new NotFoundException('Exam schedule not found');
    return exam.update(body);
  }
}
