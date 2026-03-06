import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Faculty } from '../models/faculty.model';
import { Major } from '../models/major.model';

@Injectable()
export class FacultiesService {
  constructor(@InjectModel(Faculty) private facultyModel: typeof Faculty) {}

  findAll() {
    return this.facultyModel.findAll({ include: [Major] });
  }

  create(body: { name: string; code: string }) {
    return this.facultyModel.create(body as any);
  }
}
