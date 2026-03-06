import { BelongsTo, Column, DataType, ForeignKey, HasOne, Model, Table } from 'sequelize-typescript';
import { StudentProfile } from './student-profile.model';
import { Section } from './section.model';
import { Grade } from './grade.model';

export enum EnrollmentStatus {
  ENROLLED = 'enrolled',
  DROPPED = 'dropped',
}

@Table({ tableName: 'enrollments', timestamps: true })
export class Enrollment extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  declare id: number;

  @ForeignKey(() => StudentProfile)
  @Column({ allowNull: false, type: DataType.INTEGER })
  declare student_id: number;

  @BelongsTo(() => StudentProfile)
  declare student: StudentProfile;

  @ForeignKey(() => Section)
  @Column({ allowNull: false, type: DataType.INTEGER })
  declare section_id: number;

  @BelongsTo(() => Section)
  declare section: Section;

  @Column({ allowNull: false, defaultValue: EnrollmentStatus.ENROLLED, type: DataType.ENUM(...Object.values(EnrollmentStatus)) })
  declare status: EnrollmentStatus;

  @HasOne(() => Grade)
  declare grade: Grade;
}
