import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GradesService } from './grades.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../models/user.model';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { GradeValue } from '../models/grade.model';

@Controller('grades')
@UseGuards(JwtAuthGuard)
export class GradesController {
  constructor(private gradesService: GradesService) {}

  @Get('my')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  getMyGrades(@CurrentUser() user: { id: number }) {
    return this.gradesService.getMyGrades(user.id);
  }

  @Get('student/:userId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.STAFF)
  getStudentGpa(@Param('userId') userId: string) {
    return this.gradesService.getStudentGpa(+userId);
  }

  @Get('department')
  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  getDepartmentResults(@CurrentUser() user: { id: number }) {
    return this.gradesService.getDepartmentResults(user.id);
  }

  @Get('faculty/:facultyId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STAFF)
  getFacultyResults(@Param('facultyId') facultyId: string) {
    return this.gradesService.getFacultyResults(+facultyId);
  }

  @Post('record')
  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  recordGrade(
    @CurrentUser() user: { id: number },
    @Body() body: { enrollment_id: number; grade: GradeValue },
  ) {
    return this.gradesService.recordGrade(user.id, body.enrollment_id, body.grade);
  }
}
