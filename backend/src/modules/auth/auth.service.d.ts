import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../../config/supabase.config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private supabaseService;
    private jwtService;
    constructor(supabaseService: SupabaseService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        data: {
            user: {
                id: any;
                full_name: any;
                email: any;
                role: any;
                tier: any;
                is_verified: any;
            };
            token: string;
        };
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        data: {
            user: {
                id: any;
                full_name: any;
                email: any;
                role: any;
                tier: any;
                is_verified: any;
            };
            token: string;
        };
        message: string;
    }>;
    private _generateToken;
}
