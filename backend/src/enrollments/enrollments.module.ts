import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Enrollment } from '../models/enrollment.model';
import { StudentProfile } from '../models/student-profile.model';
import { Section } from '../models/section.model';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';

@Module({
  imports: [SequelizeModule.forFeature([Enrollment, StudentProfile, Section])],
  providers: [EnrollmentsService],
  controllers: [EnrollmentsController],
})
export class EnrollmentsModule {}
