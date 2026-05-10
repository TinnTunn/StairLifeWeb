import { PrismaService } from '../../config/prisma.service';
import { FilterProjectDto } from './dto/filter-project.dto';
export declare class ProjectsRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(filter: FilterProjectDto): Promise<({
        users: {
            full_name: string;
            id: string;
            is_verified: boolean;
        };
    } & {
        id: string;
        tier: import(".prisma/client").$Enums.user_tier;
        created_at: Date | null;
        updated_at: Date | null;
        skills: string[];
        status: import(".prisma/client").$Enums.project_status | null;
        title: string;
        description: string;
        budget_min: number;
        budget_max: number;
        deadline: Date;
        category: string;
        deliverables: string | null;
        business_id: string;
        applicant_count: number | null;
    })[]>;
    findById(id: string): Promise<{
        users: {
            full_name: string;
            id: string;
            is_verified: boolean;
        };
    } & {
        id: string;
        tier: import(".prisma/client").$Enums.user_tier;
        created_at: Date | null;
        updated_at: Date | null;
        skills: string[];
        status: import(".prisma/client").$Enums.project_status | null;
        title: string;
        description: string;
        budget_min: number;
        budget_max: number;
        deadline: Date;
        category: string;
        deliverables: string | null;
        business_id: string;
        applicant_count: number | null;
    }>;
    findByBusinessId(businessId: string): Promise<{
        id: string;
        tier: import(".prisma/client").$Enums.user_tier;
        created_at: Date | null;
        updated_at: Date | null;
        skills: string[];
        status: import(".prisma/client").$Enums.project_status | null;
        title: string;
        description: string;
        budget_min: number;
        budget_max: number;
        deadline: Date;
        category: string;
        deliverables: string | null;
        business_id: string;
        applicant_count: number | null;
    }[]>;
    create(payload: any): Promise<{
        id: string;
        tier: import(".prisma/client").$Enums.user_tier;
        created_at: Date | null;
        updated_at: Date | null;
        skills: string[];
        status: import(".prisma/client").$Enums.project_status | null;
        title: string;
        description: string;
        budget_min: number;
        budget_max: number;
        deadline: Date;
        category: string;
        deliverables: string | null;
        business_id: string;
        applicant_count: number | null;
    }>;
    update(id: string, payload: any): Promise<{
        id: string;
        tier: import(".prisma/client").$Enums.user_tier;
        created_at: Date | null;
        updated_at: Date | null;
        skills: string[];
        status: import(".prisma/client").$Enums.project_status | null;
        title: string;
        description: string;
        budget_min: number;
        budget_max: number;
        deadline: Date;
        category: string;
        deliverables: string | null;
        business_id: string;
        applicant_count: number | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        tier: import(".prisma/client").$Enums.user_tier;
        created_at: Date | null;
        updated_at: Date | null;
        skills: string[];
        status: import(".prisma/client").$Enums.project_status | null;
        title: string;
        description: string;
        budget_min: number;
        budget_max: number;
        deadline: Date;
        category: string;
        deliverables: string | null;
        business_id: string;
        applicant_count: number | null;
    }>;
}
