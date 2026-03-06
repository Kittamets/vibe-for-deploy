import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Section } from '../models/section.model';
import { InstructorProfile } from '../models/instructor-profile.model';
import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';

@Module({
  imports: [SequelizeModule.forFeature([Section, InstructorProfile])],
  providers: [SectionsService],
  controllers: [SectionsController],
})
export class SectionsModule {}
