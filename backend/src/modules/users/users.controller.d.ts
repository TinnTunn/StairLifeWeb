import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SubmitVerificationDto } from './dto/submit-verification.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: any): Promise<{
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
    updateProfile(user: any, dto: UpdateProfileDto): Promise<{
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
    submitVerification(user: any, dto: SubmitVerificationDto): Promise<{
        data: any;
        message: string;
    }>;
    getVerificationStatus(user: any): Promise<{
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
