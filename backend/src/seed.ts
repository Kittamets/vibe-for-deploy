import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/sequelize';
import * as argon2 from 'argon2';
import { User, UserRole, AuthProvider } from './models/user.model';
import { Faculty } from './models/faculty.model';
import { Major } from './models/major.model';
import { StudentProfile } from './models/student-profile.model';
import { InstructorProfile } from './models/instructor-profile.model';
import { Course } from './models/course.model';
import { Semester, SemesterTerm } from './models/semester.model';
import { Section } from './models/section.model';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userModel = app.get<typeof User>(getModelToken(User));
  const facultyModel = app.get<typeof Faculty>(getModelToken(Faculty));
  const majorModel = app.get<typeof Major>(getModelToken(Major));
  const studentModel = app.get<typeof StudentProfile>(getModelToken(StudentProfile));
  const instructorModel = app.get<typeof InstructorProfile>(getModelToken(InstructorProfile));
  const courseModel = app.get<typeof Course>(getModelToken(Course));
  const semesterModel = app.get<typeof Semester>(getModelToken(Semester));
  const sectionModel = app.get<typeof Section>(getModelToken(Section));

  console.log('Seeding...');

  // Faculty
  const [faculty] = await facultyModel.findOrCreate({
    where: { code: 'ENG' },
    defaults: { name: 'คณะวิศวกรรมศาสตร์', code: 'ENG' },
  });

  // Majors
  const [majorCS] = await majorModel.findOrCreate({
    where: { code: 'CS' },
    defaults: { faculty_id: faculty.id, name: 'วิทยาการคอมพิวเตอร์', code: 'CS' },
  });
  const [majorIT] = await majorModel.findOrCreate({
    where: { code: 'IT' },
    defaults: { faculty_id: faculty.id, name: 'เทคโนโลยีสารสนเทศ', code: 'IT' },
  });

  // Semester
  const [semester] = await semesterModel.findOrCreate({
    where: { year: 2025, term: SemesterTerm.SECOND },
    defaults: { year: 2025, term: SemesterTerm.SECOND, is_active: true },
  });

  // Courses
  const [course1] = await courseModel.findOrCreate({
    where: { code: 'CS101' },
    defaults: { code: 'CS101', name: 'Introduction to Programming', credits: 3, major_id: majorCS.id },
  });
  const [course2] = await courseModel.findOrCreate({
    where: { code: 'CS201' },
    defaults: { code: 'CS201', name: 'Data Structures', credits: 3, major_id: majorCS.id },
  });
  const [course3] = await courseModel.findOrCreate({
    where: { code: 'IT101' },
    defaults: { code: 'IT101', name: 'Database Systems', credits: 3, major_id: majorIT.id },
  });

  // Users
  const hash = await argon2.hash('password123');

  const [staffUser] = await userModel.findOrCreate({
    where: { email: 'staff@test.com' },
    defaults: { email: 'staff@test.com', password_hash: hash, auth_provider: AuthProvider.LOCAL, role: UserRole.STAFF },
  });

  const [instructorUser] = await userModel.findOrCreate({
    where: { email: 'instructor@test.com' },
    defaults: { email: 'instructor@test.com', password_hash: hash, auth_provider: AuthProvider.LOCAL, role: UserRole.INSTRUCTOR },
  });

  const [studentUser] = await userModel.findOrCreate({
    where: { email: 'student@test.com' },
    defaults: { email: 'student@test.com', password_hash: hash, auth_provider: AuthProvider.LOCAL, role: UserRole.STUDENT },
  });

  // Profiles
  const [instructor] = await instructorModel.findOrCreate({
    where: { user_id: instructorUser.id },
    defaults: { user_id: instructorUser.id, first_name: 'สมชาย', last_name: 'ใจดี', faculty_id: faculty.id, major_id: majorCS.id },
  });

  await studentModel.findOrCreate({
    where: { user_id: studentUser.id },
    defaults: { user_id: studentUser.id, student_id_no: '6601234001', first_name: 'สมหญิง', last_name: 'เรียนดี', faculty_id: faculty.id, major_id: majorCS.id, year_of_study: 2 },
  });

  // Sections
  await sectionModel.findOrCreate({
    where: { course_id: course1.id, semester_id: semester.id },
    defaults: { course_id: course1.id, semester_id: semester.id, instructor_id: instructor.id, max_students: 40, room: 'E201', schedule_json: { '1': '09:00-12:00', '3': '13:00-15:00' } },
  });
  await sectionModel.findOrCreate({
    where: { course_id: course2.id, semester_id: semester.id },
    defaults: { course_id: course2.id, semester_id: semester.id, instructor_id: instructor.id, max_students: 30, room: 'E301', schedule_json: { '2': '09:00-12:00' } },
  });
  await sectionModel.findOrCreate({
    where: { course_id: course3.id, semester_id: semester.id },
    defaults: { course_id: course3.id, semester_id: semester.id, instructor_id: instructor.id, max_students: 35, room: 'E101', schedule_json: { '4': '13:00-16:00' } },
  });

  console.log('\n✅ Seed complete!\n');
  console.log('Test accounts (password: password123)');
  console.log('  Staff:      staff@test.com');
  console.log('  Instructor: instructor@test.com');
  console.log('  Student:    student@test.com');

  await app.close();
}

seed().catch((e) => { console.error(e); process.exit(1); });
