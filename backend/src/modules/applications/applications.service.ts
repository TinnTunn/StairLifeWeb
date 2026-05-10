import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ApplicationsRepository } from './applications.repository';
import { ProjectsRepository } from '../projects/projects.repository';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { SupabaseService } from '../../config/supabase.config';

@Injectable()
export class ApplicationsService {
  constructor(
    private applicationsRepository: ApplicationsRepository,
    private projectsRepository: ProjectsRepository,
    private supabaseService: SupabaseService,
  ) {}

  async applyToProject(dto: CreateApplicationDto, studentId: string) {
    // Cek project ada
    const project = await this.projectsRepository.findById(dto.project_id);
    if (!project) {
      throw new NotFoundException('Project tidak ditemukan');
    }

    // Cek project masih open
    if (project.status !== 'open') {
      throw new BadRequestException('Project sudah tidak menerima lamaran');
    }

    // Cek sudah pernah melamar
    const existing = await this.applicationsRepository.findByProjectAndStudent(
      dto.project_id,
      studentId,
    );
    if (existing) {
      throw new ConflictException('Kamu sudah pernah melamar project ini');
    }

    // Buat lamaran
    const payload = {
      ...dto,
      student_id: studentId,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    const application = await this.applicationsRepository.create(payload);

    // Update applicant count
    await this.supabaseService.getClient()
      .from('projects')
      .update({ applicant_count: project.applicant_count + 1 })
      .eq('id', dto.project_id);

    return { data: application, message: 'Lamaran berhasil dikirim' };
  }

  async getMyApplications(studentId: string) {
    const applications = await this.applicationsRepository.findByStudentId(studentId);
    return { data: applications, message: 'Berhasil' };
  }

  async getProjectApplications(projectId: string, businessId: string) {
    // Cek project milik bisnis ini
    const project = await this.projectsRepository.findById(projectId);
    if (!project) {
      throw new NotFoundException('Project tidak ditemukan');
    }
    if (project.business_id !== businessId) {
      throw new ForbiddenException('Kamu tidak punya akses ke project ini');
    }

    const applications = await this.applicationsRepository.findByProjectId(projectId);
    return { data: applications, message: 'Berhasil' };
  }

  async updateApplicationStatus(
    id: string,
    dto: UpdateApplicationStatusDto,
    businessId: string,
  ) {
    // Cek lamaran ada
    const application = await this.applicationsRepository.findById(id);
    if (!application) {
      throw new NotFoundException('Lamaran tidak ditemukan');
    }

    // Cek project milik bisnis ini
    const project = await this.projectsRepository.findById(application.project_id);
    if (project.business_id !== businessId) {
      throw new ForbiddenException('Kamu tidak punya akses ke lamaran ini');
    }

    const updated = await this.applicationsRepository.updateStatus(id, dto.status);
    return { data: updated, message: `Lamaran berhasil di-${dto.status}` };
  }
}