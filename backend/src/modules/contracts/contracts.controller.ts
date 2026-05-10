import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UploadDeliverableDto } from './dto/upload-deliverable.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('contracts')
@UseGuards(JwtAuthGuard)
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  // POST /api/v1/contracts — bisnis buat kontrak
  @Post()
  @UseGuards(RolesGuard)
  @Roles('bisnis')
  async create(
    @Body() dto: CreateContractDto,
    @CurrentUser() user: any,
  ) {
    return this.contractsService.createContract(dto, user.id);
  }

  // GET /api/v1/contracts/my — lihat kontrak sendiri
  @Get('my')
  async getMyContracts(@CurrentUser() user: any) {
    return this.contractsService.getMyContracts(user.id, user.role);
  }

  // GET /api/v1/contracts/:id
  @Get(':id')
  async getById(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.contractsService.getContractById(id, user.id);
  }

  // PATCH /api/v1/contracts/:id/deliverable — mahasiswa upload deliverable
  @Patch(':id/deliverable')
  @UseGuards(RolesGuard)
  @Roles('mahasiswa')
  async uploadDeliverable(
    @Param('id') id: string,
    @Body() dto: UploadDeliverableDto,
    @CurrentUser() user: any,
  ) {
    return this.contractsService.uploadDeliverable(id, dto, user.id);
  }

  // PATCH /api/v1/contracts/:id/approve — bisnis approve deliverable
  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles('bisnis')
  async approveDeliverable(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.contractsService.approveDeliverable(id, user.id);
  }
}