import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Faculty } from './faculty.model';
import { Course } from './course.model';
import { StudentProfile } from './student-profile.model';
import { InstructorProfile } from './instructor-profile.model';

@Table({ tableName: 'majors', timestamps: true })
export class Major extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  declare id: number;

  @ForeignKey(() => Faculty)
  @Column({ allowNull: false, type: DataType.INTEGER })
  declare faculty_id: number;

  @BelongsTo(() => Faculty)
  declare faculty: Faculty;

  @Column({ allowNull: false, type: DataType.STRING })
  declare name: string;

  @Column({ allowNull: false, unique: true, type: DataType.STRING(20) })
  declare code: string;

  @HasMany(() => Course)
  declare courses: Course[];

  @HasMany(() => StudentProfile)
  declare studentProfiles: StudentProfile[];

  @HasMany(() => InstructorProfile)
  declare instructorProfiles: InstructorProfile[];
}
