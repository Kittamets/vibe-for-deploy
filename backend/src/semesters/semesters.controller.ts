import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { SemestersService } from './semesters.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../models/user.model';
import { SemesterTerm } from '../models/semester.model';

@Controller('semesters')
@UseGuards(JwtAuthGuard)
export class SemestersController {
  constructor(private semestersService: SemestersService) {}

  @Get()
  findAll() {
    return this.semestersService.findAll();
  }

  @Get('active')
  getActive() {
    return this.semestersService.getActive();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.STAFF)
  create(@Body() body: { year: number; term: SemesterTerm }) {
    return this.semestersService.create(body);
  }

  @Patch(':id/activate')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STAFF)
  setActive(@Param('id') id: string) {
    return this.semestersService.setActive(+id);
  }
}
