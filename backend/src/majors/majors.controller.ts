import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { MajorsService } from './majors.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../models/user.model';

@Controller('majors')
@UseGuards(JwtAuthGuard)
export class MajorsController {
  constructor(private majorsService: MajorsService) {}

  @Get()
  findAll(@Query('faculty_id') facultyId?: string) {
    return this.majorsService.findAll(facultyId ? +facultyId : undefined);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.STAFF)
  create(@Body() body: { faculty_id: number; name: string; code: string }) {
    return this.majorsService.create(body);
  }
}
