import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Enrollment, EnrollmentStatus } from '../models/enrollment.model';
import { Section } from '../models/section.model';
import { StudentProfile } from '../models/student-profile.model';
import { Course } from '../models/course.model';
import { Semester } from '../models/semester.model';
import { Grade } from '../models/grade.model';
import { ExamSchedule } from '../models/exam-schedule.model';
import { InstructorProfile } from '../models/instructor-profile.model';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectModel(Enrollment) private enrollmentModel: typeof Enrollment,
    @InjectModel(StudentProfile) private studentProfileModel: typeof StudentProfile,
    @InjectModel(Section) private sectionModel: typeof Section,
  ) {}

  async getMyEnrollments(userId: number) {
    const student = await this.studentProfileModel.findOne({ where: { user_id: userId } });
    if (!student) throw new NotFoundException('Student profile not found');

    return this.enrollmentModel.findAll({
      where: { student_id: student.id, status: EnrollmentStatus.ENROLLED },
      include: [
        { model: Section, include: [Course, Semester, { model: InstructorProfile }, ExamSchedule] },
        { model: Grade },
      ],
    });
  }

  async enroll(userId: number, sectionId: number) {
    const student = await this.studentProfileModel.findOne({ where: { user_id: userId } });
    if (!student) throw new NotFoundException('Student profile not found');

    const section = await this.sectionModel.findByPk(sectionId);
    if (!section) throw new NotFoundException('Section not found');

    const existing = await this.enrollmentModel.findOne({
      where: { student_id: student.id, section_id: sectionId },
    });
    if (existing && existing.status === EnrollmentStatus.ENROLLED) {
      throw new BadRequestException('Already enrolled in this section');
    }

    const count = await this.enrollmentModel.count({
      where: { section_id: sectionId, status: EnrollmentStatus.ENROLLED },
    });
    if (count >= section.max_students) {
      throw new BadRequestException('Section is full');
    }

    if (existing) {
      return existing.update({ status: EnrollmentStatus.ENROLLED });
    }
    return this.enrollmentModel.create({ student_id: student.id, section_id: sectionId } as any);
  }

  async drop(userId: number, enrollmentId: number) {
    const student = await this.studentProfileModel.findOne({ where: { user_id: userId } });
    if (!student) throw new NotFoundException('Student profile not found');

    const enrollment = await this.enrollmentModel.findOne({
      where: { id: enrollmentId, student_id: student.id },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    return enrollment.update({ status: EnrollmentStatus.DROPPED });
  }
}
