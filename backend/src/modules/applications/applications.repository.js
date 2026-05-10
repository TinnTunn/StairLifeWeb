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
exports.ApplicationsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
let ApplicationsRepository = class ApplicationsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(payload) {
        return this.prisma.applications.create({
            data: {
                ...payload,
                estimated_completion: new Date(payload.estimated_completion),
                status: 'pending',
            },
        });
    }
    async findByStudentId(studentId) {
        return this.prisma.applications.findMany({
            where: { student_id: studentId },
            include: {
                projects: {
                    select: {
                        id: true,
                        title: true,
                        budget_min: true,
                        budget_max: true,
                        category: true,
                        tier: true,
                        status: true,
                        users: {
                            select: { id: true, full_name: true },
                        },
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async findByProjectId(projectId) {
        return this.prisma.applications.findMany({
            where: { project_id: projectId },
            include: {
                users: {
                    select: {
                        id: true,
                        full_name: true,
                        tier: true,
                        is_verified: true,
                        rating_avg: true,
                        total_projects: true,
                        skills: true,
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async findById(id) {
        return this.prisma.applications.findUnique({
            where: { id },
        });
    }
    async findByProjectAndStudent(projectId, studentId) {
        return this.prisma.applications.findUnique({
            where: {
                project_id_student_id: {
                    project_id: projectId,
                    student_id: studentId,
                },
            },
            select: { id: true },
        });
    }
    async updateStatus(id, status) {
        return this.prisma.applications.update({
            where: { id },
            data: { status: status },
        });
    }
};
exports.ApplicationsRepository = ApplicationsRepository;
exports.ApplicationsRepository = ApplicationsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApplicationsRepository);
//# sourceMappingURL=applications.repository.js.map