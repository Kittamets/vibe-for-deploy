import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ExamSchedulesService } from './exam-schedules.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../models/user.model';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('exam-schedules')
@UseGuards(JwtAuthGuard)
export class ExamSchedulesController {
  constructor(private examSchedulesService: ExamSchedulesService) {}

  @Get('my')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  getMyExams(@CurrentUser() user: { id: number }) {
    return this.examSchedulesService.getMyExams(user.id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.STAFF)
  create(@Body() body: any) {
    return this.examSchedulesService.create(body);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STAFF)
  update(@Param('id') id: string, @Body() body: any) {
    return this.examSchedulesService.update(+id, body);
  }
}
