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
exports.ProjectsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
let ProjectsRepository = class ProjectsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filter) {
        return this.prisma.projects.findMany({
            where: {
                status: 'open',
                ...(filter.tier && { tier: filter.tier }),
                ...(filter.category && {
                    category: { contains: filter.category, mode: 'insensitive' },
                }),
                ...(filter.search && {
                    OR: [
                        { title: { contains: filter.search, mode: 'insensitive' } },
                        { description: { contains: filter.search, mode: 'insensitive' } },
                    ],
                }),
            },
            include: {
                users: {
                    select: { id: true, full_name: true, is_verified: true },
                },
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async findById(id) {
        return this.prisma.projects.findUnique({
            where: { id },
            include: {
                users: {
                    select: { id: true, full_name: true, is_verified: true },
                },
            },
        });
    }
    async findByBusinessId(businessId) {
        return this.prisma.projects.findMany({
            where: { business_id: businessId },
            orderBy: { created_at: 'desc' },
        });
    }
    async create(payload) {
        return this.prisma.projects.create({
            data: payload,
        });
    }
    async update(id, payload) {
        return this.prisma.projects.update({
            where: { id },
            data: { ...payload, updated_at: new Date() },
        });
    }
    async delete(id) {
        return this.prisma.projects.delete({
            where: { id },
        });
    }
};
exports.ProjectsRepository = ProjectsRepository;
exports.ProjectsRepository = ProjectsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsRepository);
//# sourceMappingURL=projects.repository.js.map