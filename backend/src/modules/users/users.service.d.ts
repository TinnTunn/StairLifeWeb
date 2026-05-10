import { SupabaseService } from '../../config/supabase.config';
import { UsersRepository } from './users.repository';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SubmitVerificationDto } from './dto/submit-verification.dto';
export declare class UsersService {
    private usersRepository;
    private supabaseService;
    constructor(usersRepository: UsersRepository, supabaseService: SupabaseService);
    getMe(userId: string): Promise<{
        data: {
            full_name: string;
            email: string;
            role: import(".prisma/client").$Enums.user_role;
            id: string;
            tier: import(".prisma/client").$Enums.user_tier;
            is_verified: boolean;
            created_at: Date;
            avatar_url: string;
            bio: string;
            university: string;
            major: string;
            semester: number;
            skills: string[];
            portfolio_url: string;
            rating_avg: import("@prisma/client-runtime-utils").Decimal;
            total_projects: number;
        };
        message: string;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        data: {
            full_name: string;
            email: string;
            role: import(".prisma/client").$Enums.user_role;
            id: string;
            tier: import(".prisma/client").$Enums.user_tier;
            is_verified: boolean;
            avatar_url: string;
            bio: string;
            university: string;
            major: string;
            semester: number;
            skills: string[];
            portfolio_url: string;
        };
        message: string;
    }>;
    submitVerification(userId: string, dto: SubmitVerificationDto): Promise<{
        data: any;
        message: string;
    }>;
    getVerificationStatus(userId: string): Promise<{
        data: {
            id: any;
            status: any;
            submitted_at: any;
            reviewed_at: any;
            rejection_reason: any;
        };
        message: string;
    }>;
}
