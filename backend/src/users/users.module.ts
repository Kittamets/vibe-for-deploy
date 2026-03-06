import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../models/user.model';
import { StudentProfile } from '../models/student-profile.model';
import { InstructorProfile } from '../models/instructor-profile.model';

@Module({
  imports: [SequelizeModule.forFeature([User, StudentProfile, InstructorProfile])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
