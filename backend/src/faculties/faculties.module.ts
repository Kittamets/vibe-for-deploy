import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Faculty } from '../models/faculty.model';
import { FacultiesService } from './faculties.service';
import { FacultiesController } from './faculties.controller';

@Module({
  imports: [SequelizeModule.forFeature([Faculty])],
  providers: [FacultiesService],
  controllers: [FacultiesController],
})
export class FacultiesModule {}
