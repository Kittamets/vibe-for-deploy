import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { FacultiesService } from './faculties.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../models/user.model';

@Controller('faculties')
@UseGuards(JwtAuthGuard)
export class FacultiesController {
  constructor(private facultiesService: FacultiesService) {}

  @Get()
  findAll() {
    return this.facultiesService.findAll();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.STAFF)
  create(@Body() body: { name: string; code: string }) {
    return this.facultiesService.create(body);
  }
}
