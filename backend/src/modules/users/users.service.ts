import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../../config/supabase.config';
import { UsersRepository } from './users.repository';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SubmitVerificationDto } from './dto/submit-verification.dto';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private supabaseService: SupabaseService,
  ) {}

  async getMe(userId: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }
    return { data: user, message: 'Berhasil' };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.usersRepository.update(userId, dto);
    return { data: user, message: 'Profil berhasil diperbarui' };
  }

  async submitVerification(userId: string, dto: SubmitVerificationDto) {
    const supabase = this.supabaseService.getClient();

    // Cek apakah sudah ada verifikasi sebelumnya
    const { data: existing } = await supabase
      .from('verifications')
      .select('id, status')
      .eq('user_id', userId)
      .single();

    if (existing) {
      // Update verifikasi yang sudah ada
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

      if (error) throw new Error(error.message);
      return { data, message: 'Verifikasi berhasil diperbarui' };
    }

    // Buat verifikasi baru
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

    if (error) throw new Error(error.message);
    return { data, message: 'Verifikasi berhasil diajukan' };
  }

  async getVerificationStatus(userId: string) {
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
}