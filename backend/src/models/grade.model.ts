import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Enrollment } from './enrollment.model';
import { User } from './user.model';

export enum GradeValue {
  A = 'A',
  B_PLUS = 'B+',
  B = 'B',
  C_PLUS = 'C+',
  C = 'C',
  D_PLUS = 'D+',
  D = 'D',
  F = 'F',
  W = 'W',
  I = 'I',
}

@Table({ tableName: 'grades', timestamps: true })
export class Grade extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  declare id: number;

  @ForeignKey(() => Enrollment)
  @Column({ allowNull: false, unique: true, type: DataType.INTEGER })
  declare enrollment_id: number;

  @BelongsTo(() => Enrollment)
  declare enrollment: Enrollment;

  @Column({ allowNull: false, type: DataType.ENUM(...Object.values(GradeValue)) })
  declare grade: GradeValue;

  @ForeignKey(() => User)
  @Column({ allowNull: false, type: DataType.INTEGER })
  declare recorded_by: number;

  @BelongsTo(() => User, 'recorded_by')
  declare recorder: User;
}
