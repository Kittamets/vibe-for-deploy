import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Section } from './section.model';

export enum SemesterTerm {
  FIRST = '1',
  SECOND = '2',
  SUMMER = 'summer',
}

@Table({ tableName: 'semesters', timestamps: true })
export class Semester extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  declare id: number;

  @Column({ allowNull: false, type: DataType.INTEGER })
  declare year: number;

  @Column({ allowNull: false, type: DataType.ENUM(...Object.values(SemesterTerm)) })
  declare term: SemesterTerm;

  @Column({ allowNull: false, defaultValue: false, type: DataType.BOOLEAN })
  declare is_active: boolean;

  @HasMany(() => Section)
  declare sections: Section[];
}
