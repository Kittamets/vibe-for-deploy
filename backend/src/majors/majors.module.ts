import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Major } from '../models/major.model';
import { MajorsService } from './majors.service';
import { MajorsController } from './majors.controller';

@Module({
  imports: [SequelizeModule.forFeature([Major])],
  providers: [MajorsService],
  controllers: [MajorsController],
})
export class MajorsModule {}
