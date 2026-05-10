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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const supabase_config_1 = require("../../config/supabase.config");
let AdminService = class AdminService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async getStats() {
        const supabase = this.supabaseService.getClient();
        const [{ count: totalUsers }, { count: totalProjects }, { count: activeProjects }, { count: pendingVerifications }, { count: activeDisputes },] = await Promise.all([
            supabase.from('users').select('*', { count: 'exact', head: true }),
            supabase.from('projects').select('*', { count: 'exact', head: true }),
            supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'open'),
            supabase.from('verifications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
            supabase.from('disputes').select('*', { count: 'exact', head: true }).eq('status', 'open'),
        ]);
        return {
            data: {
                total_users: totalUsers,
                total_projects: totalProjects,
                active_projects: activeProjects,
                pending_verifications: pendingVerifications,
                active_disputes: activeDisputes,
            },
            message: 'Berhasil',
        };
    }
    async getAllUsers(role) {
        const supabase = this.supabaseService.getClient();
        let query = supabase
            .from('users')
            .select('id, full_name, email, role, tier, is_verified, created_at')
            .order('created_at', { ascending: false });
        if (role)
            query = query.eq('role', role);
        const { data, error } = await query;
        if (error)
            throw new Error(error.message);
        return { data, message: 'Berhasil' };
    }
    async suspendUser(userId, adminId) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('users')
            .update({ is_suspended: true, updated_at: new Date().toISOString() })
            .eq('id', userId)
            .select('id, full_name, email, role')
            .single();
        if (error)
            throw new common_1.NotFoundException('User tidak ditemukan');
        return { data, message: 'User berhasil disuspend' };
    }
    async getPendingVerifications(status = 'pending') {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('verifications')
            .select(`
        *,
        user:users!user_id (
          id, full_name, email, university
        )
      `)
            .eq('status', status)
            .order('submitted_at', { ascending: true });
        if (error)
            throw new Error(error.message);
        return { data, message: 'Berhasil' };
    }
    async reviewVerification(verificationId, dto, adminId) {
        const supabase = this.supabaseService.getClient();
        const { data: verification } = await supabase
            .from('verifications')
            .select('id, user_id')
            .eq('id', verificationId)
            .single();
        if (!verification)
            throw new common_1.NotFoundException('Verifikasi tidak ditemukan');
        const { data, error } = await supabase
            .from('verifications')
            .update({
            status: dto.status,
            reviewed_by: adminId,
            rejection_reason: dto.rejection_reason ?? null,
            reviewed_at: new Date().toISOString(),
        })
            .eq('id', verificationId)
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        if (dto.status === 'approved') {
            await supabase
                .from('users')
                .update({ is_verified: true, updated_at: new Date().toISOString() })
                .eq('id', verification.user_id);
        }
        return {
            data,
            message: dto.status === 'approved'
                ? 'Verifikasi disetujui'
                : 'Verifikasi ditolak',
        };
    }
    async getAllDisputes(status) {
        const supabase = this.supabaseService.getClient();
        let query = supabase
            .from('disputes')
            .select(`
        *,
        contract:contracts!contract_id (
          id, agreed_budget,
          project:projects!project_id (id, title)
        ),
        opened_by_user:users!opened_by (id, full_name, role)
      `)
            .order('created_at', { ascending: false });
        if (status)
            query = query.eq('status', status);
        const { data, error } = await query;
        if (error)
            throw new Error(error.message);
        return { data, message: 'Berhasil' };
    }
    async resolveDispute(disputeId, dto, adminId) {
        const supabase = this.supabaseService.getClient();
        const { data: dispute } = await supabase
            .from('disputes')
            .select('id')
            .eq('id', disputeId)
            .single();
        if (!dispute)
            throw new common_1.NotFoundException('Dispute tidak ditemukan');
        const { data, error } = await supabase
            .from('disputes')
            .update({
            status: dto.status,
            admin_notes: dto.admin_notes,
            resolved_by: adminId,
            resolved_at: dto.status === 'resolved' ? new Date().toISOString() : null,
        })
            .eq('id', disputeId)
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return { data, message: 'Dispute berhasil diupdate' };
    }
    async getAllProjects(status) {
        const supabase = this.supabaseService.getClient();
        let query = supabase
            .from('projects')
            .select(`
        *,
        business:users!business_id (id, full_name)
      `)
            .order('created_at', { ascending: false });
        if (status)
            query = query.eq('status', status);
        const { data, error } = await query;
        if (error)
            throw new Error(error.message);
        return { data, message: 'Berhasil' };
    }
    async sendAnnouncement(dto, adminId) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('announcements')
            .insert({
            title: dto.title,
            body: dto.body,
            target: dto.target,
            sent_by: adminId,
            created_at: new Date().toISOString(),
        })
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return { data, message: 'Announcement berhasil dikirim' };
    }
    async getAnnouncements() {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('announcements')
            .select('*')
            .order('created_at', { ascending: false });
        if (error)
            throw new Error(error.message);
        return { data, message: 'Berhasil' };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_config_1.SupabaseService])
], AdminService);
//# sourceMappingURL=admin.service.js.map