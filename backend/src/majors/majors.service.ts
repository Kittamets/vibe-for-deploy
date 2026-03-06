import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Major } from '../models/major.model';
import { Faculty } from '../models/faculty.model';

@Injectable()
export class MajorsService {
  constructor(@InjectModel(Major) private majorModel: typeof Major) {}

  findAll(facultyId?: number) {
    const where = facultyId ? { faculty_id: facultyId } : {};
    return this.majorModel.findAll({ where, include: [Faculty] });
  }

  create(body: { faculty_id: number; name: string; code: string }) {
    return this.majorModel.create(body as any);
  }
}
