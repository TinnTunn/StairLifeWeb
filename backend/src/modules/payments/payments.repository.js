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
exports.PaymentsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma.service");
let PaymentsRepository = class PaymentsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(payload) {
        return this.prisma.payments.create({
            data: {
                ...payload,
                status: 'held',
            },
        });
    }
    async findById(id) {
        return this.prisma.payments.findUnique({
            where: { id },
            include: {
                contracts: {
                    select: {
                        id: true,
                        agreed_budget: true,
                        status: true,
                        projects: {
                            select: { id: true, title: true },
                        },
                    },
                },
            },
        });
    }
    async findByContractId(contractId) {
        return this.prisma.payments.findFirst({
            where: { contract_id: contractId },
        });
    }
    async findByUserId(userId) {
        return this.prisma.payments.findMany({
            where: {
                OR: [
                    { payer_id: userId },
                    { payee_id: userId },
                ],
            },
            include: {
                contracts: {
                    select: {
                        id: true,
                        agreed_budget: true,
                        projects: {
                            select: { id: true, title: true },
                        },
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async update(id, payload) {
        return this.prisma.payments.update({
            where: { id },
            data: payload,
        });
    }
};
exports.PaymentsRepository = PaymentsRepository;
exports.PaymentsRepository = PaymentsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsRepository);
//# sourceMappingURL=payments.repository.js.map