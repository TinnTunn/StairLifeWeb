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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const supabase_config_1 = require("../../config/supabase.config");
let ChatService = class ChatService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async getMessages(contractId) {
        const { data, error } = await this.supabase
            .getClient()
            .from('messages')
            .select(`
        *,
        sender:users!sender_id (id, full_name, role)
      `)
            .eq('contract_id', contractId)
            .order('created_at', { ascending: true });
        if (error)
            throw new Error(error.message);
        return data || [];
    }
    async saveMessage(contractId, senderId, content) {
        const { data, error } = await this.supabase
            .getClient()
            .from('messages')
            .insert({
            contract_id: contractId,
            sender_id: senderId,
            content,
            created_at: new Date().toISOString(),
        })
            .select(`
        *,
        sender:users!sender_id (id, full_name, role)
      `)
            .single();
        if (error)
            throw new Error(error.message);
        return data;
    }
    async markAsRead(contractId, userId) {
        await this.supabase
            .getClient()
            .from('messages')
            .update({ is_read: true })
            .eq('contract_id', contractId)
            .neq('sender_id', userId);
    }
    async validateContractAccess(contractId, userId) {
        const { data } = await this.supabase
            .getClient()
            .from('contracts')
            .select('id')
            .eq('id', contractId)
            .or(`student_id.eq.${userId},business_id.eq.${userId}`)
            .maybeSingle();
        return !!data;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_config_1.SupabaseService])
], ChatService);
//# sourceMappingURL=chat.service.js.map