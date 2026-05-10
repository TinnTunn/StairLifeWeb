"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const applications_repository_1 = require("./applications.repository");
const projects_repository_1 = require("../projects/projects.repository");
const supabase_config_1 = require("../../config/supabase.config");
let ApplicationsService = class ApplicationsService {
    constructor(applicationsRepository, projectsRepository, supabaseService) {
        this.applicationsRepository = applicationsRepository;
        this.projectsRepository = projectsRepository;
        this.supabaseService = supabaseService;
    }
    async applyToProject(dto, studentId) {
        const project = await this.projectsRepository.findById(dto.project_id);
        if (!project) {
            throw new common_1.NotFoundException('Project tidak ditemukan');
        }
        if (project.status !== 'open') {
            throw new common_1.BadRequestException('Project sudah tidak menerima lamaran');
        }
        const existing = await this.applicationsRepository.findByProjectAndStudent(dto.project_id, studentId);
        if (existing) {
            throw new common_1.ConflictException('Kamu sudah pernah melamar project ini');
        }
        const payload = {
            ...dto,
            student_id: studentId,
            status: 'pending',
            created_at: new Date().toISOString(),
        };
        const application = await this.applicationsRepository.create(payload);
        await this.supabaseService.getClient()
            .from('projects')
            .update({ applicant_count: project.applicant_count + 1 })
            .eq('id', dto.project_id);
        return { data: application, message: 'Lamaran berhasil dikirim' };
    }
    async getMyApplications(studentId) {
        const applications = await this.applicationsRepository.findByStudentId(studentId);
        return { data: applications, message: 'Berhasil' };
    }
    async getProjectApplications(projectId, businessId) {
        const project = await this.projectsRepository.findById(projectId);
        if (!project) {
            throw new common_1.NotFoundException('Project tidak ditemukan');
        }
        if (project.business_id !== businessId) {
            throw new common_1.ForbiddenException('Kamu tidak punya akses ke project ini');
        }
        const applications = await this.applicationsRepository.findByProjectId(projectId);
        return { data: applications, message: 'Berhasil' };
    }
    async updateApplicationStatus(id, dto, businessId) {
        const application = await this.applicationsRepository.findById(id);
        if (!application) {
            throw new common_1.NotFoundException('Lamaran tidak ditemukan');
        }
        const project = await this.projectsRepository.findById(application.project_id);
        if (project.business_id !== businessId) {
            throw new common_1.ForbiddenException('Kamu tidak punya akses ke lamaran ini');
        }
        const updated = await this.applicationsRepository.updateStatus(id, dto.status);
        return { data: updated, message: `Lamaran berhasil di-${dto.status}` };
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [applications_repository_1.ApplicationsRepository,
        projects_repository_1.ProjectsRepository,
        supabase_config_1.SupabaseService])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map