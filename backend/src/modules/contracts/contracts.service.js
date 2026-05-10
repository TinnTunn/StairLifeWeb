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
exports.ContractsService = void 0;
const common_1 = require("@nestjs/common");
const contracts_repository_1 = require("./contracts.repository");
const applications_repository_1 = require("../applications/applications.repository");
const projects_repository_1 = require("../projects/projects.repository");
const supabase_config_1 = require("../../config/supabase.config");
let ContractsService = class ContractsService {
    constructor(contractsRepository, applicationsRepository, projectsRepository, supabaseService) {
        this.contractsRepository = contractsRepository;
        this.applicationsRepository = applicationsRepository;
        this.projectsRepository = projectsRepository;
        this.supabaseService = supabaseService;
    }
    async createContract(dto, businessId) {
        const application = await this.applicationsRepository.findById(dto.application_id);
        if (!application) {
            throw new common_1.NotFoundException('Lamaran tidak ditemukan');
        }
        const project = await this.projectsRepository.findById(application.project_id);
        if (project.business_id !== businessId) {
            throw new common_1.ForbiddenException('Kamu tidak punya akses');
        }
        if (application.status !== 'approved') {
            throw new common_1.BadRequestException('Lamaran harus di-approve dulu sebelum membuat kontrak');
        }
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
        await this.projectsRepository.update(application.project_id, {
            status: 'inProgress',
        });
        return { data: contract, message: 'Kontrak berhasil dibuat' };
    }
    async getMyContracts(userId, role) {
        let contracts;
        if (role === 'mahasiswa') {
            contracts = await this.contractsRepository.findByStudentId(userId);
        }
        else {
            contracts = await this.contractsRepository.findByBusinessId(userId);
        }
        return { data: contracts, message: 'Berhasil' };
    }
    async getContractById(id, userId) {
        const contract = await this.contractsRepository.findById(id);
        if (!contract) {
            throw new common_1.NotFoundException('Kontrak tidak ditemukan');
        }
        if (contract.student_id !== userId && contract.business_id !== userId) {
            throw new common_1.ForbiddenException('Kamu tidak punya akses ke kontrak ini');
        }
        return { data: contract, message: 'Berhasil' };
    }
    async uploadDeliverable(id, dto, studentId) {
        const contract = await this.contractsRepository.findById(id);
        if (!contract) {
            throw new common_1.NotFoundException('Kontrak tidak ditemukan');
        }
        if (contract.student_id !== studentId) {
            throw new common_1.ForbiddenException('Hanya mahasiswa yang mengerjakan yang bisa upload');
        }
        if (contract.status !== 'active') {
            throw new common_1.BadRequestException('Kontrak tidak dalam status aktif');
        }
        const updated = await this.contractsRepository.update(id, {
            deliverable_url: dto.deliverable_url,
            deliverable_notes: dto.deliverable_notes,
            progress_pct: dto.progress_pct ?? 100,
            status: 'pending_review',
        });
        return { data: updated, message: 'Deliverable berhasil diupload' };
    }
    async approveDeliverable(id, businessId) {
        const contract = await this.contractsRepository.findById(id);
        if (!contract) {
            throw new common_1.NotFoundException('Kontrak tidak ditemukan');
        }
        if (contract.business_id !== businessId) {
            throw new common_1.ForbiddenException('Hanya klien yang bisa approve deliverable');
        }
        if (contract.status !== 'pending_review') {
            throw new common_1.BadRequestException('Kontrak tidak dalam status pending review');
        }
        const updated = await this.contractsRepository.update(id, {
            status: 'completed',
            progress_pct: 100,
            completed_at: new Date().toISOString(),
        });
        await this.projectsRepository.update(contract.project_id, {
            status: 'completed',
        });
        await this.supabaseService.getClient()
            .from('users')
            .update({
            total_projects: this.supabaseService.getClient()
                .rpc('increment', { row_id: contract.student_id }),
        })
            .eq('id', contract.student_id);
        return { data: updated, message: 'Deliverable disetujui, kontrak selesai!' };
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [contracts_repository_1.ContractsRepository,
        applications_repository_1.ApplicationsRepository,
        projects_repository_1.ProjectsRepository,
        supabase_config_1.SupabaseService])
], ContractsService);
//# sourceMappingURL=contracts.service.js.map