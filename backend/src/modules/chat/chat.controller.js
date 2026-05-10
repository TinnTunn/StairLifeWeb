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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const supabase_config_1 = require("../../config/supabase.config");
const class_validator_1 = require("class-validator");
class SendMessageDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "content", void 0);
class DirectMessageDto {
}
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], DirectMessageDto.prototype, "receiver_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DirectMessageDto.prototype, "content", void 0);
let ChatController = class ChatController {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async getMyRooms(user) {
        const supabase = this.supabase.getClient();
        const { data: contracts } = await supabase
            .from('contracts')
            .select(`
        id, status, agreed_budget,
        projects!project_id (id, title),
        users_contracts_student_idTousers:users!student_id (id, full_name),
        users_contracts_business_idTousers:users!business_id (id, full_name)
      `)
            .or(`student_id.eq.${user.id},business_id.eq.${user.id}`)
            .order('created_at', { ascending: false });
        return { data: contracts || [], message: 'Berhasil' };
    }
    async getMessages(contractId, user) {
        const { data, error } = await this.supabase.getClient()
            .from('messages')
            .select(`
        *,
        sender:users!sender_id (id, full_name, role)
      `)
            .eq('contract_id', contractId)
            .order('created_at', { ascending: true });
        if (error)
            throw new Error(error.message);
        return { data, message: 'Berhasil' };
    }
    async sendMessage(contractId, dto, user) {
        const { data, error } = await this.supabase.getClient()
            .from('messages')
            .insert({
            contract_id: contractId,
            sender_id: user.id,
            content: dto.content,
            created_at: new Date().toISOString(),
        })
            .select(`
        *,
        sender:users!sender_id (id, full_name, role)
      `)
            .single();
        if (error)
            throw new Error(error.message);
        return { data, message: 'Pesan terkirim' };
    }
    async sendDirectMessage(dto, user) {
        const supabase = this.supabase.getClient();
        const { data: contract } = await supabase
            .from('contracts')
            .select('id')
            .or(`and(student_id.eq.${user.id},business_id.eq.${dto.receiver_id}),and(student_id.eq.${dto.receiver_id},business_id.eq.${user.id})`)
            .limit(1)
            .maybeSingle();
        if (!contract) {
            return {
                data: null,
                message: 'Belum ada kontrak. Chat tersedia setelah kontrak dibuat.',
            };
        }
        const { data, error } = await supabase
            .from('messages')
            .insert({
            contract_id: contract.id,
            sender_id: user.id,
            content: dto.content,
            created_at: new Date().toISOString(),
        })
            .select(`*, sender:users!sender_id (id, full_name, role)`)
            .single();
        if (error)
            throw new Error(error.message);
        return { data, message: 'Pesan terkirim' };
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)('rooms'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getMyRooms", null);
__decorate([
    (0, common_1.Get)(':contractId/messages'),
    __param(0, (0, common_1.Param)('contractId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)(':contractId/messages'),
    __param(0, (0, common_1.Param)('contractId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, SendMessageDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Post)('direct'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DirectMessageDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendDirectMessage", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [supabase_config_1.SupabaseService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map