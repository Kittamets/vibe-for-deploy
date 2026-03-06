import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Section } from '../models/section.model';
import { Course } from '../models/course.model';
import { Semester } from '../models/semester.model';
import { InstructorProfile } from '../models/instructor-profile.model';
import { Enrollment } from '../models/enrollment.model';
import { StudentProfile } from '../models/student-profile.model';
import { User } from '../models/user.model';
import { ExamSchedule } from '../models/exam-schedule.model';

@Injectable()
export class SectionsService {
  constructor(
    @InjectModel(Section) private sectionModel: typeof Section,
    @InjectModel(InstructorProfile) private instructorModel: typeof InstructorProfile,
  ) {}

  findAvailable(semesterId?: number) {
    const where = semesterId ? { semester_id: semesterId } : {};
    return this.sectionModel.findAll({
      where,
      include: [
        { model: Course },
        { model: Semester },
        { model: InstructorProfile, include: [User] },
        { model: ExamSchedule },
      ],
    });
  }

  async findMySchedule(userId: number, semesterId?: number) {
    const instructor = await this.instructorModel.findOne({ where: { user_id: userId } });
    if (!instructor) throw new NotFoundException('Instructor profile not found');
    const where: any = { instructor_id: instructor.id };
    if (semesterId) where.semester_id = semesterId;
    return this.sectionModel.findAll({
      where,
      include: [Course, Semester, ExamSchedule],
    });
  }

  async findStudents(sectionId: number) {
    const section = await this.sectionModel.findByPk(sectionId, {
      include: [
        {
          model: Enrollment,
          include: [{ model: StudentProfile, include: [User] }],
        },
      ],
    });
    if (!section) throw new NotFoundException('Section not found');
    return section;
  }

  create(body: { course_id: number; semester_id: number; instructor_id?: number; max_students: number; room?: string; schedule_json?: object }) {
    return this.sectionModel.create(body as any);
  }

  async update(id: number, body: Partial<{ instructor_id: number; max_students: number; room: string; schedule_json: object }>) {
    const section = await this.sectionModel.findByPk(id);
    if (!section) throw new NotFoundException('Section not found');
    return section.update(body);
  }
}
