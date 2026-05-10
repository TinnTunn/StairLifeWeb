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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const supabase_config_1 = require("../../config/supabase.config");
const users_repository_1 = require("./users.repository");
let UsersService = class UsersService {
    constructor(usersRepository, supabaseService) {
        this.usersRepository = usersRepository;
        this.supabaseService = supabaseService;
    }
    async getMe(userId) {
        const user = await this.usersRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User tidak ditemukan');
        }
        return { data: user, message: 'Berhasil' };
    }
    async updateProfile(userId, dto) {
        const user = await this.usersRepository.update(userId, dto);
        return { data: user, message: 'Profil berhasil diperbarui' };
    }
    async submitVerification(userId, dto) {
        const supabase = this.supabaseService.getClient();
        const { data: existing } = await supabase
            .from('verifications')
            .select('id, status')
            .eq('user_id', userId)
            .single();
        if (existing) {
            const { data, error } = await supabase
                .from('verifications')
                .update({
                ...dto,
                status: 'pending',
                submitted_at: new Date().toISOString(),
            })
                .eq('user_id', userId)
                .select()
                .single();
            if (error)
                throw new Error(error.message);
            return { data, message: 'Verifikasi berhasil diperbarui' };
        }
        const { data, error } = await supabase
            .from('verifications')
            .insert({
            user_id: userId,
            ...dto,
            status: 'pending',
            submitted_at: new Date().toISOString(),
        })
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return { data, message: 'Verifikasi berhasil diajukan' };
    }
    async getVerificationStatus(userId) {
        const supabase = this.supabaseService.getClient();
        const { data } = await supabase
            .from('verifications')
            .select('id, status, submitted_at, reviewed_at, rejection_reason')
            .eq('user_id', userId)
            .single();
        return {
            data: data ?? null,
            message: data ? 'Berhasil' : 'Belum ada pengajuan verifikasi',
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository,
        supabase_config_1.SupabaseService])
], UsersService);
//# sourceMappingURL=users.service.js.map