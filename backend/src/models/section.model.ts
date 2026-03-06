import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Course } from './course.model';
import { Semester } from './semester.model';
import { InstructorProfile } from './instructor-profile.model';
import { Enrollment } from './enrollment.model';
import { ExamSchedule } from './exam-schedule.model';

@Table({ tableName: 'sections', timestamps: true })
export class Section extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  declare id: number;

  @ForeignKey(() => Course)
  @Column({ allowNull: false, type: DataType.INTEGER })
  declare course_id: number;

  @BelongsTo(() => Course)
  declare course: Course;

  @ForeignKey(() => Semester)
  @Column({ allowNull: false, type: DataType.INTEGER })
  declare semester_id: number;

  @BelongsTo(() => Semester)
  declare semester: Semester;

  @ForeignKey(() => InstructorProfile)
  @Column({ allowNull: true, type: DataType.INTEGER })
  declare instructor_id: number;

  @BelongsTo(() => InstructorProfile)
  declare instructor: InstructorProfile;

  @Column({ allowNull: false, type: DataType.INTEGER })
  declare max_students: number;

  @Column({ allowNull: true, type: DataType.STRING })
  declare room: string;

  @Column({ allowNull: true, type: DataType.JSON })
  declare schedule_json: object;

  @HasMany(() => Enrollment)
  declare enrollments: Enrollment[];

  @HasMany(() => ExamSchedule)
  declare examSchedules: ExamSchedule[];
}
