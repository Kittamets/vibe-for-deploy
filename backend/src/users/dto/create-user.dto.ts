import { IsEmail, IsEnum, IsInt, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';
import { AuthProvider, UserRole } from '../../models/user.model';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsEnum(AuthProvider)
  auth_provider: AuthProvider;

  @ValidateIf((o) => o.auth_provider === AuthProvider.LOCAL)
  @IsString()
  @MinLength(6)
  password?: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsInt()
  faculty_id: number;

  @IsInt()
  major_id: number;

  @ValidateIf((o) => o.role === UserRole.STUDENT)
  @IsString()
  student_id_no?: string;

  @ValidateIf((o) => o.role === UserRole.STUDENT)
  @IsInt()
  @IsOptional()
  year_of_study?: number;
}
