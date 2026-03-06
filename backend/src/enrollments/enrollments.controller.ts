import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../models/user.model';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('enrollments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STUDENT)
export class EnrollmentsController {
  constructor(private enrollmentsService: EnrollmentsService) {}

  @Get('my')
  getMyEnrollments(@CurrentUser() user: { id: number }) {
    return this.enrollmentsService.getMyEnrollments(user.id);
  }

  @Post()
  enroll(@CurrentUser() user: { id: number }, @Body('section_id') sectionId: number) {
    return this.enrollmentsService.enroll(user.id, sectionId);
  }

  @Delete(':id')
  drop(@CurrentUser() user: { id: number }, @Param('id') id: string) {
    return this.enrollmentsService.drop(user.id, +id);
  }
}
