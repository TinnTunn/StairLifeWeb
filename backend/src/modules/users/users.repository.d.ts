import { PrismaService } from '../../config/prisma.service';
export declare class UsersRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
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
    }>;
    findByEmail(email: string): Promise<{
        full_name: string;
        email: string;
        role: import(".prisma/client").$Enums.user_role;
        id: string;
        tier: import(".prisma/client").$Enums.user_tier;
        is_verified: boolean;
    }>;
    update(id: string, payload: any): Promise<{
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
    }>;
    findAll(): Promise<{
        full_name: string;
        email: string;
        role: import(".prisma/client").$Enums.user_role;
        id: string;
        tier: import(".prisma/client").$Enums.user_tier;
        is_verified: boolean;
        created_at: Date;
    }[]>;
}
