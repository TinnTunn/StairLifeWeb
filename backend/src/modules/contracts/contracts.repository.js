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
exports.ContractsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
let ContractsRepository = class ContractsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(payload) {
        return this.prisma.contracts.create({
            data: {
                ...payload,
                deadline: new Date(payload.deadline),
                status: 'active',
            },
        });
    }
    async findById(id) {
        return this.prisma.contracts.findUnique({
            where: { id },
            include: {
                projects: {
                    select: { id: true, title: true, category: true, tier: true },
                },
                users_contracts_student_idTousers: {
                    select: { id: true, full_name: true, email: true, rating_avg: true },
                },
                users_contracts_business_idTousers: {
                    select: { id: true, full_name: true, email: true },
                },
            },
        });
    }
    async findByStudentId(studentId) {
        return this.prisma.contracts.findMany({
            where: { student_id: studentId },
            include: {
                projects: {
                    select: { id: true, title: true, category: true, tier: true },
                },
                users_contracts_business_idTousers: {
                    select: { id: true, full_name: true },
                },
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async findByBusinessId(businessId) {
        return this.prisma.contracts.findMany({
            where: { business_id: businessId },
            include: {
                projects: {
                    select: { id: true, title: true, category: true, tier: true },
                },
                users_contracts_student_idTousers: {
                    select: { id: true, full_name: true, rating_avg: true },
                },
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async update(id, payload) {
        return this.prisma.contracts.update({
            where: { id },
            data: payload,
        });
    }
};
exports.ContractsRepository = ContractsRepository;
exports.ContractsRepository = ContractsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContractsRepository);
//# sourceMappingURL=contracts.repository.js.map