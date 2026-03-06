import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as argon2 from 'argon2';
import { User, AuthProvider, UserRole } from '../models/user.model';
import { StudentProfile } from '../models/student-profile.model';
import { InstructorProfile } from '../models/instructor-profile.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(StudentProfile) private studentProfileModel: typeof StudentProfile,
    @InjectModel(InstructorProfile) private instructorProfileModel: typeof InstructorProfile,
  ) {}

  async create(dto: CreateUserDto) {
    const existing = await this.userModel.findOne({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email already exists');

    let password_hash: string | null = null;
    if (dto.auth_provider === AuthProvider.LOCAL) {
      password_hash = await argon2.hash(dto.password!);
    }

    const user = await this.userModel.create({
      email: dto.email,
      password_hash,
      auth_provider: dto.auth_provider,
      role: dto.role,
    });

    if (dto.role === UserRole.STUDENT) {
      await this.studentProfileModel.create({
        user_id: user.id,
        student_id_no: dto.student_id_no,
        first_name: dto.first_name,
        last_name: dto.last_name,
        faculty_id: dto.faculty_id,
        major_id: dto.major_id,
        year_of_study: dto.year_of_study,
      });
    } else if (dto.role === UserRole.INSTRUCTOR) {
      await this.instructorProfileModel.create({
        user_id: user.id,
        first_name: dto.first_name,
        last_name: dto.last_name,
        faculty_id: dto.faculty_id,
        major_id: dto.major_id,
      });
    }

    return { message: 'User created', userId: user.id };
  }

  async findAll() {
    return this.userModel.findAll({
      attributes: ['id', 'email', 'role', 'auth_provider'],
      include: [
        { model: StudentProfile },
        { model: InstructorProfile },
      ],
    });
  }

  async findOne(id: number) {
    const user = await this.userModel.findByPk(id, {
      attributes: ['id', 'email', 'role', 'auth_provider'],
      include: [{ model: StudentProfile }, { model: InstructorProfile }],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
