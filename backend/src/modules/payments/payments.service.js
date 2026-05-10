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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const payments_repository_1 = require("./payments.repository");
const contracts_repository_1 = require("../contracts/contracts.repository");
const PLATFORM_FEE_PERCENT = 5;
let PaymentsService = class PaymentsService {
    constructor(paymentsRepository, contractsRepository) {
        this.paymentsRepository = paymentsRepository;
        this.contractsRepository = contractsRepository;
    }
    async holdEscrow(dto, businessId) {
        const contract = await this.contractsRepository.findById(dto.contract_id);
        if (!contract) {
            throw new common_1.NotFoundException('Kontrak tidak ditemukan');
        }
        if (contract.business_id !== businessId) {
            throw new common_1.ForbiddenException('Hanya klien yang bisa melakukan pembayaran');
        }
        const existing = await this.paymentsRepository.findByContractId(dto.contract_id);
        if (existing) {
            throw new common_1.ConflictException('Pembayaran untuk kontrak ini sudah ada');
        }
        const platformFee = Math.round(dto.amount * (PLATFORM_FEE_PERCENT / 100));
        const netAmount = dto.amount - platformFee;
        const payload = {
            contract_id: dto.contract_id,
            amount: dto.amount,
            platform_fee: platformFee,
            net_amount: netAmount,
            status: 'held',
            payer_id: businessId,
            payee_id: contract.student_id,
            held_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
        };
        const payment = await this.paymentsRepository.create(payload);
        return {
            data: payment,
            message: `Dana Rp ${dto.amount.toLocaleString('id-ID')} berhasil ditahan di escrow`,
        };
    }
    async releaseEscrow(paymentId, businessId) {
        const payment = await this.paymentsRepository.findById(paymentId);
        if (!payment) {
            throw new common_1.NotFoundException('Pembayaran tidak ditemukan');
        }
        if (payment.payer_id !== businessId) {
            throw new common_1.ForbiddenException('Hanya pembayar yang bisa release escrow');
        }
        if (payment.status !== 'held') {
            throw new common_1.BadRequestException('Dana tidak dalam status escrow');
        }
        const updated = await this.paymentsRepository.update(paymentId, {
            status: 'released',
            released_at: new Date().toISOString(),
        });
        return {
            data: updated,
            message: `Dana Rp ${payment.net_amount.toLocaleString('id-ID')} berhasil dicairkan ke mahasiswa`,
        };
    }
    async getMyPayments(userId) {
        const payments = await this.paymentsRepository.findByUserId(userId);
        return { data: payments, message: 'Berhasil' };
    }
    async getPaymentByContract(contractId, userId) {
        const contract = await this.contractsRepository.findById(contractId);
        if (!contract) {
            throw new common_1.NotFoundException('Kontrak tidak ditemukan');
        }
        if (contract.student_id !== userId && contract.business_id !== userId) {
            throw new common_1.ForbiddenException('Kamu tidak punya akses');
        }
        const payment = await this.paymentsRepository.findByContractId(contractId);
        return {
            data: payment ?? null,
            message: payment ? 'Berhasil' : 'Belum ada pembayaran',
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payments_repository_1.PaymentsRepository,
        contracts_repository_1.ContractsRepository])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map