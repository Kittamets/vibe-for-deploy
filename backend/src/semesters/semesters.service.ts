import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Semester, SemesterTerm } from '../models/semester.model';

@Injectable()
export class SemestersService {
  constructor(@InjectModel(Semester) private semesterModel: typeof Semester) {}

  findAll() {
    return this.semesterModel.findAll({ order: [['year', 'DESC'], ['term', 'ASC']] });
  }

  getActive() {
    return this.semesterModel.findOne({ where: { is_active: true } });
  }

  create(body: { year: number; term: SemesterTerm }) {
    return this.semesterModel.create(body as any);
  }

  async setActive(id: number) {
    await this.semesterModel.update({ is_active: false }, { where: {} });
    await this.semesterModel.update({ is_active: true }, { where: { id } });
    return this.semesterModel.findByPk(id);
  }
}
