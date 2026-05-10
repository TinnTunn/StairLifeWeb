import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ContractsRepository } from './contracts.repository';
import { ApplicationsRepository } from '../applications/applications.repository';
import { ProjectsRepository } from '../projects/projects.repository';
import { CreateContractDto } from './dto/create-contract.dto';
import { UploadDeliverableDto } from './dto/upload-deliverable.dto';
import { SupabaseService } from '../../config/supabase.config';

@Injectable()
export class ContractsService {
  constructor(
    private contractsRepository: ContractsRepository,
    private applicationsRepository: ApplicationsRepository,
    private projectsRepository: ProjectsRepository,
    private supabaseService: SupabaseService,
  ) {}

  async createContract(dto: CreateContractDto, businessId: string) {
    // Cek application ada
    const application = await this.applicationsRepository.findById(dto.application_id);
    if (!application) {
      throw new NotFoundException('Lamaran tidak ditemukan');
    }

    // Cek project milik bisnis ini
    const project = await this.projectsRepository.findById(application.project_id);
    if (project.business_id !== businessId) {
      throw new ForbiddenException('Kamu tidak punya akses');
    }

    // Cek application sudah approved
    if (application.status !== 'approved') {
      throw new BadRequestException('Lamaran harus di-approve dulu sebelum membuat kontrak');
    }

    // Buat kontrak
    const payload = {
      project_id: application.project_id,
      student_id: application.student_id,
      business_id: businessId,
      application_id: dto.application_id,
      agreed_budget: dto.agreed_budget,
      deadline: dto.deadline,
      status: 'active',
      progress_pct: 0,
      started_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    const contract = await this.contractsRepository.create(payload);

    // Update project status ke inProgress
    await this.projectsRepository.update(application.project_id, {
      status: 'inProgress',
    });

    return { data: contract, message: 'Kontrak berhasil dibuat' };
  }

  async getMyContracts(userId: string, role: string) {
    let contracts;
    if (role === 'mahasiswa') {
      contracts = await this.contractsRepository.findByStudentId(userId);
    } else {
      contracts = await this.contractsRepository.findByBusinessId(userId);
    }
    return { data: contracts, message: 'Berhasil' };
  }

  async getContractById(id: string, userId: string) {
    const contract = await this.contractsRepository.findById(id);
    if (!contract) {
      throw new NotFoundException('Kontrak tidak ditemukan');
    }

    // Cek akses
    if (contract.student_id !== userId && contract.business_id !== userId) {
      throw new ForbiddenException('Kamu tidak punya akses ke kontrak ini');
    }

    return { data: contract, message: 'Berhasil' };
  }

  async uploadDeliverable(id: string, dto: UploadDeliverableDto, studentId: string) {
    const contract = await this.contractsRepository.findById(id);
    if (!contract) {
      throw new NotFoundException('Kontrak tidak ditemukan');
    }

    if (contract.student_id !== studentId) {
      throw new ForbiddenException('Hanya mahasiswa yang mengerjakan yang bisa upload');
    }

    if (contract.status !== 'active') {
      throw new BadRequestException('Kontrak tidak dalam status aktif');
    }

    const updated = await this.contractsRepository.update(id, {
      deliverable_url: dto.deliverable_url,
      deliverable_notes: dto.deliverable_notes,
      progress_pct: dto.progress_pct ?? 100,
      status: 'pending_review',
    });

    return { data: updated, message: 'Deliverable berhasil diupload' };
  }

  async approveDeliverable(id: string, businessId: string) {
    const contract = await this.contractsRepository.findById(id);
    if (!contract) {
      throw new NotFoundException('Kontrak tidak ditemukan');
    }

    if (contract.business_id !== businessId) {
      throw new ForbiddenException('Hanya klien yang bisa approve deliverable');
    }

    if (contract.status !== 'pending_review') {
      throw new BadRequestException('Kontrak tidak dalam status pending review');
    }

    const updated = await this.contractsRepository.update(id, {
      status: 'completed',
      progress_pct: 100,
      completed_at: new Date().toISOString(),
    });

    // Update project status ke completed
    await this.projectsRepository.update(contract.project_id, {
      status: 'completed',
    });

    // Update student total_projects
    await this.supabaseService.getClient()
      .from('users')
      .update({
        total_projects: this.supabaseService.getClient()
          .rpc('increment', { row_id: contract.student_id }),
      })
      .eq('id', contract.student_id);

    return { data: updated, message: 'Deliverable disetujui, kontrak selesai!' };
  }
}