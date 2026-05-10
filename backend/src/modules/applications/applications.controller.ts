import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  // POST /api/v1/applications — mahasiswa melamar
  @Post()
  @UseGuards(RolesGuard)
  @Roles('mahasiswa')
  async apply(
    @Body() dto: CreateApplicationDto,
    @CurrentUser() user: any,
  ) {
    return this.applicationsService.applyToProject(dto, user.id);
  }

  // GET /api/v1/applications/my — mahasiswa lihat lamaran sendiri
  @Get('my')
  @UseGuards(RolesGuard)
  @Roles('mahasiswa')
  async getMyApplications(@CurrentUser() user: any) {
    return this.applicationsService.getMyApplications(user.id);
  }

  // GET /api/v1/applications/project/:projectId — bisnis lihat lamaran masuk
  @Get('project/:projectId')
  @UseGuards(RolesGuard)
  @Roles('bisnis')
  async getProjectApplications(
    @Param('projectId') projectId: string,
    @CurrentUser() user: any,
  ) {
    return this.applicationsService.getProjectApplications(projectId, user.id);
  }

  // PATCH /api/v1/applications/:id/status — bisnis approve/reject
  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('bisnis')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.applicationsService.updateApplicationStatus(id, dto, user.id);
  }
}