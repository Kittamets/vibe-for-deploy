import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript';
import { StudentProfile } from './student-profile.model';
import { InstructorProfile } from './instructor-profile.model';

export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  STAFF = 'staff',
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
}

@Table({ tableName: 'users', timestamps: true })
export class User extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  declare id: number;

  @Column({ unique: true, allowNull: false, type: DataType.STRING })
  declare email: string;

  @Column({ allowNull: true, type: DataType.STRING })
  declare password_hash: string;

  @Column({ allowNull: false, type: DataType.ENUM(...Object.values(AuthProvider)) })
  declare auth_provider: AuthProvider;

  @Column({ allowNull: false, type: DataType.ENUM(...Object.values(UserRole)) })
  declare role: UserRole;

  @HasOne(() => StudentProfile)
  declare studentProfile: StudentProfile;

  @HasOne(() => InstructorProfile)
  declare instructorProfile: InstructorProfile;
}
