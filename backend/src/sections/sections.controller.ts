import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../models/user.model';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('sections')
@UseGuards(JwtAuthGuard)
export class SectionsController {
  constructor(private sectionsService: SectionsService) {}

  @Get()
  findAll(@Query('semester_id') semesterId?: string) {
    return this.sectionsService.findAvailable(semesterId ? +semesterId : undefined);
  }

  @Get('mine')
  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  findMine(
    @CurrentUser() user: { id: number },
    @Query('semester_id') semesterId?: string,
  ) {
    return this.sectionsService.findMySchedule(user.id, semesterId ? +semesterId : undefined);
  }

  @Get(':id/students')
  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.STAFF)
  findStudents(@Param('id') id: string) {
    return this.sectionsService.findStudents(+id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.STAFF)
  create(@Body() body: any) {
    return this.sectionsService.create(body);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STAFF)
  update(@Param('id') id: string, @Body() body: any) {
    return this.sectionsService.update(+id, body);
  }
}
