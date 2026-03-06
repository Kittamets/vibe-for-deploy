import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Section } from './section.model';

export enum ExamType {
  MIDTERM = 'midterm',
  FINAL = 'final',
}

@Table({ tableName: 'exam_schedules', timestamps: true })
export class ExamSchedule extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  declare id: number;

  @ForeignKey(() => Section)
  @Column({ allowNull: false, type: DataType.INTEGER })
  declare section_id: number;

  @BelongsTo(() => Section)
  declare section: Section;

  @Column({ allowNull: false, type: DataType.DATEONLY })
  declare date: string;

  @Column({ allowNull: false, type: DataType.TIME })
  declare start_time: string;

  @Column({ allowNull: false, type: DataType.TIME })
  declare end_time: string;

  @Column({ allowNull: true, type: DataType.STRING })
  declare room: string;

  @Column({ allowNull: false, type: DataType.ENUM(...Object.values(ExamType)) })
  declare type: ExamType;
}
