import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../../config/supabase.config';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private supabaseService: SupabaseService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const supabase = this.supabaseService.getClient();

    // Cek email sudah terdaftar
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', dto.email)
      .single();

    if (existing) {
      throw new ConflictException('Email sudah terdaftar');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // Insert user baru
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        full_name: dto.full_name,
        email: dto.email,
        password_hash: hashedPassword,
        role: dto.role,
        tier: 'pemula',
        is_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('id, full_name, email, role, tier, is_verified')
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    // Generate JWT token
    const token = this._generateToken(user);

    return {
      data: { user, token },
      message: 'Pendaftaran berhasil',
    };
  }

  async login(dto: LoginDto) {
    const supabase = this.supabaseService.getClient();

    // Cari user by email
    const { data: user } = await supabase
      .from('users')
      .select('id, full_name, email, role, tier, is_verified, password_hash')
      .eq('email', dto.email)
      .single();

    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    // Hapus password dari response
    const { password_hash, ...userWithoutPassword } = user;
    const token = this._generateToken(userWithoutPassword);

    return {
      data: { user: userWithoutPassword, token },
      message: 'Login berhasil',
    };
  }

  private _generateToken(user: any): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }
}