import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Faculty } from './models/faculty.model';
import { Major } from './models/major.model';
import { StudentProfile } from './models/student-profile.model';
import { InstructorProfile } from './models/instructor-profile.model';
import { Course } from './models/course.model';
import { Semester } from './models/semester.model';
import { Section } from './models/section.model';
import { Enrollment } from './models/enrollment.model';
import { Grade } from './models/grade.model';
import { ExamSchedule } from './models/exam-schedule.model';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FacultiesModule } from './faculties/faculties.module';
import { MajorsModule } from './majors/majors.module';
import { CoursesModule } from './courses/courses.module';
import { SemestersModule } from './semesters/semesters.module';
import { SectionsModule } from './sections/sections.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { GradesModule } from './grades/grades.module';
import { ExamSchedulesModule } from './exam-schedules/exam-schedules.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'mysql',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get('DB_USER', 'root'),
        password: config.get('DB_PASS', ''),
        database: config.get('DB_NAME', 'registrar_db'),
        models: [
          User, Faculty, Major, StudentProfile, InstructorProfile,
          Course, Semester, Section, Enrollment, Grade, ExamSchedule,
        ],
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    FacultiesModule,
    MajorsModule,
    CoursesModule,
    SemestersModule,
    SectionsModule,
    EnrollmentsModule,
    GradesModule,
    ExamSchedulesModule,
  ],
})
export class AppModule {}
