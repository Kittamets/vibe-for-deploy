import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Course } from '../models/course.model';
import { Major } from '../models/major.model';

@Injectable()
export class CoursesService {
  constructor(@InjectModel(Course) private courseModel: typeof Course) {}

  findAll(majorId?: number) {
    const where = majorId ? { major_id: majorId } : {};
    return this.courseModel.findAll({ where, include: [Major] });
  }

  create(body: { code: string; name: string; credits: number; major_id: number }) {
    return this.courseModel.create(body as any);
  }
}
