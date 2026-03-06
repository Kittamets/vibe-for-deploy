import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Grade, GradeValue } from '../models/grade.model';
import { Enrollment } from '../models/enrollment.model';
import { Section } from '../models/section.model';
import { Course } from '../models/course.model';
import { StudentProfile } from '../models/student-profile.model';
import { InstructorProfile } from '../models/instructor-profile.model';
import { Major } from '../models/major.model';
import { Faculty } from '../models/faculty.model';

const GRADE_POINTS: Record<GradeValue, number> = {
  [GradeValue.A]: 4.0,
  [GradeValue.B_PLUS]: 3.5,
  [GradeValue.B]: 3.0,
  [GradeValue.C_PLUS]: 2.5,
  [GradeValue.C]: 2.0,
  [GradeValue.D_PLUS]: 1.5,
  [GradeValue.D]: 1.0,
  [GradeValue.F]: 0,
  [GradeValue.W]: -1,
  [GradeValue.I]: -1,
};

@Injectable()
export class GradesService {
  constructor(
    @InjectModel(Grade) private gradeModel: typeof Grade,
    @InjectModel(Enrollment) private enrollmentModel: typeof Enrollment,
    @InjectModel(StudentProfile) private studentProfileModel: typeof StudentProfile,
    @InjectModel(InstructorProfile) private instructorProfileModel: typeof InstructorProfile,
    @InjectModel(Section) private sectionModel: typeof Section,
  ) {}

  async getMyGrades(userId: number) {
    const student = await this.studentProfileModel.findOne({ where: { user_id: userId } });
    if (!student) throw new NotFoundException('Student profile not found');

    const enrollments = await this.enrollmentModel.findAll({
      where: { student_id: student.id },
      include: [{ model: Section, include: [Course] }, { model: Grade }],
    });

    const gpa = this.calculateGpa(enrollments);
    return { enrollments, gpa };
  }

  async getStudentGpa(studentUserId: number) {
    const student = await this.studentProfileModel.findOne({
      where: { user_id: studentUserId },
      include: [Major, Faculty],
    });
    if (!student) throw new NotFoundException('Student not found');

    const enrollments = await this.enrollmentModel.findAll({
      where: { student_id: student.id },
      include: [{ model: Section, include: [Course] }, { model: Grade }],
    });

    const gpa = this.calculateGpa(enrollments);
    return { student, enrollments, gpa };
  }

  async getDepartmentResults(instructorUserId: number) {
    const instructor = await this.instructorProfileModel.findOne({
      where: { user_id: instructorUserId },
    });
    if (!instructor) throw new NotFoundException('Instructor profile not found');

    const students = await this.studentProfileModel.findAll({
      where: { major_id: instructor.major_id },
      include: [{ model: Enrollment, include: [{ model: Section, include: [Course] }, Grade] }],
    });

    return students.map((s) => ({
      student: s,
      gpa: this.calculateGpa(s.enrollments),
    }));
  }

  async getFacultyResults(facultyId: number) {
    const students = await this.studentProfileModel.findAll({
      where: { faculty_id: facultyId },
      include: [
        Major,
        { model: Enrollment, include: [{ model: Section, include: [Course] }, Grade] },
      ],
    });

    return students.map((s) => ({
      student: s,
      gpa: this.calculateGpa(s.enrollments),
    }));
  }

  async recordGrade(instructorUserId: number, enrollmentId: number, grade: GradeValue) {
    const instructor = await this.instructorProfileModel.findOne({
      where: { user_id: instructorUserId },
    });
    if (!instructor) throw new NotFoundException('Instructor profile not found');

    const enrollment = await this.enrollmentModel.findByPk(enrollmentId, {
      include: [Section],
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    if (enrollment.section.instructor_id !== instructor.id) {
      throw new ForbiddenException('Not responsible for this section');
    }

    const existing = await this.gradeModel.findOne({ where: { enrollment_id: enrollmentId } });
    if (existing) {
      return existing.update({ grade, recorded_by: instructorUserId });
    }
    return this.gradeModel.create({
      enrollment_id: enrollmentId,
      grade,
      recorded_by: instructorUserId,
    } as any);
  }

  private calculateGpa(enrollments: Enrollment[]): number {
    let totalPoints = 0;
    let totalCredits = 0;

    for (const e of enrollments) {
      const g = e.grade;
      if (!g) continue;
      const points = GRADE_POINTS[g.grade];
      if (points < 0) continue;
      const credits = (e.section?.course as any)?.credits ?? 0;
      totalPoints += points * credits;
      totalCredits += credits;
    }

    return totalCredits === 0 ? 0 : Math.round((totalPoints / totalCredits) * 100) / 100;
  }
}
