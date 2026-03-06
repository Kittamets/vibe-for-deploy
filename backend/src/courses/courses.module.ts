import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Course } from '../models/course.model';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';

@Module({
  imports: [SequelizeModule.forFeature([Course])],
  providers: [CoursesService],
  controllers: [CoursesController],
})
export class CoursesModule {}
