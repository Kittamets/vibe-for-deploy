import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../models/user.model';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  findAll(@Query('major_id') majorId?: string) {
    return this.coursesService.findAll(majorId ? +majorId : undefined);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.STAFF)
  create(@Body() body: { code: string; name: string; credits: number; major_id: number }) {
    return this.coursesService.create(body);
  }
}
