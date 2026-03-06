import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ExamSchedule } from '../models/exam-schedule.model';
import { StudentProfile } from '../models/student-profile.model';
import { Enrollment } from '../models/enrollment.model';
import { ExamSchedulesService } from './exam-schedules.service';
import { ExamSchedulesController } from './exam-schedules.controller';

@Module({
  imports: [SequelizeModule.forFeature([ExamSchedule, StudentProfile, Enrollment])],
  providers: [ExamSchedulesService],
  controllers: [ExamSchedulesController],
})
export class ExamSchedulesModule {}
