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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const review_verification_dto_1 = require("./dto/review-verification.dto");
const resolve_dispute_dto_1 = require("./dto/resolve-dispute.dto");
const send_announcement_dto_1 = require("./dto/send-announcement.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getStats() {
        return this.adminService.getStats();
    }
    async getAllUsers(role) {
        return this.adminService.getAllUsers(role);
    }
    async suspendUser(id, user) {
        return this.adminService.suspendUser(id, user.id);
    }
    async getVerifications(status) {
        return this.adminService.getPendingVerifications(status);
    }
    async reviewVerification(id, dto, user) {
        return this.adminService.reviewVerification(id, dto, user.id);
    }
    async getDisputes(status) {
        return this.adminService.getAllDisputes(status);
    }
    async resolveDispute(id, dto, user) {
        return this.adminService.resolveDispute(id, dto, user.id);
    }
    async getAllProjects(status) {
        return this.adminService.getAllProjects(status);
    }
    async sendAnnouncement(dto, user) {
        return this.adminService.sendAnnouncement(dto, user.id);
    }
    async getAnnouncements() {
        return this.adminService.getAnnouncements();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Query)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Patch)('users/:id/suspend'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "suspendUser", null);
__decorate([
    (0, common_1.Get)('verifications'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getVerifications", null);
__decorate([
    (0, common_1.Patch)('verifications/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, review_verification_dto_1.ReviewVerificationDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "reviewVerification", null);
__decorate([
    (0, common_1.Get)('disputes'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDisputes", null);
__decorate([
    (0, common_1.Patch)('disputes/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, resolve_dispute_dto_1.ResolveDisputeDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "resolveDispute", null);
__decorate([
    (0, common_1.Get)('projects'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllProjects", null);
__decorate([
    (0, common_1.Post)('announcements'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_announcement_dto_1.SendAnnouncementDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "sendAnnouncement", null);
__decorate([
    (0, common_1.Get)('announcements'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAnnouncements", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map