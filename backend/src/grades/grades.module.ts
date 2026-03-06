import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Grade } from '../models/grade.model';
import { Enrollment } from '../models/enrollment.model';
import { StudentProfile } from '../models/student-profile.model';
import { InstructorProfile } from '../models/instructor-profile.model';
import { Section } from '../models/section.model';
import { GradesService } from './grades.service';
import { GradesController } from './grades.controller';

@Module({
  imports: [SequelizeModule.forFeature([Grade, Enrollment, StudentProfile, InstructorProfile, Section])],
  providers: [GradesService],
  controllers: [GradesController],
})
export class GradesModule {}
