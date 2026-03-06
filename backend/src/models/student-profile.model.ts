import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';
import { Faculty } from './faculty.model';
import { Major } from './major.model';
import { Enrollment } from './enrollment.model';

@Table({ tableName: 'student_profiles', timestamps: true })
export class StudentProfile extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  declare id: number;

  @ForeignKey(() => User)
  @Column({ allowNull: false, unique: true, type: DataType.INTEGER })
  declare user_id: number;

  @BelongsTo(() => User)
  declare user: User;

  @Column({ allowNull: false, unique: true, type: DataType.STRING(20) })
  declare student_id_no: string;

  @Column({ allowNull: false, type: DataType.STRING })
  declare first_name: string;

  @Column({ allowNull: false, type: DataType.STRING })
  declare last_name: string;

  @ForeignKey(() => Faculty)
  @Column({ allowNull: false, type: DataType.INTEGER })
  declare faculty_id: number;

  @BelongsTo(() => Faculty)
  declare faculty: Faculty;

  @ForeignKey(() => Major)
  @Column({ allowNull: false, type: DataType.INTEGER })
  declare major_id: number;

  @BelongsTo(() => Major)
  declare major: Major;

  @Column({ allowNull: false, type: DataType.INTEGER })
  declare year_of_study: number;

  @HasMany(() => Enrollment)
  declare enrollments: Enrollment[];
}
