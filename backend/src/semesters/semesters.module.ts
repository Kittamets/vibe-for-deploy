import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Semester } from '../models/semester.model';
import { SemestersService } from './semesters.service';
import { SemestersController } from './semesters.controller';

@Module({
  imports: [SequelizeModule.forFeature([Semester])],
  providers: [SemestersService],
  controllers: [SemestersController],
  exports: [SemestersService],
})
export class SemestersModule {}
