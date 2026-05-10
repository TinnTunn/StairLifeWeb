import { PrismaService } from '../../config/prisma.service';
export declare class ContractsRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(payload: any): Promise<{
        id: string;
        created_at: Date | null;
        status: import(".prisma/client").$Enums.contract_status | null;
        deadline: Date;
        business_id: string;
        project_id: string;
        student_id: string;
        agreed_budget: number;
        progress_pct: number | null;
        deliverable_url: string | null;
        deliverable_notes: string | null;
        started_at: Date | null;
        completed_at: Date | null;
        application_id: string;
    }>;
    findById(id: string): Promise<{
        projects: {
            id: string;
            tier: import(".prisma/client").$Enums.user_tier;
            title: string;
            category: string;
        };
        users_contracts_business_idTousers: {
            full_name: string;
            email: string;
            id: string;
        };
        users_contracts_student_idTousers: {
            full_name: string;
            email: string;
            id: string;
            rating_avg: import("@prisma/client-runtime-utils").Decimal;
        };
    } & {
        id: string;
        created_at: Date | null;
        status: import(".prisma/client").$Enums.contract_status | null;
        deadline: Date;
        business_id: string;
        project_id: string;
        student_id: string;
        agreed_budget: number;
        progress_pct: number | null;
        deliverable_url: string | null;
        deliverable_notes: string | null;
        started_at: Date | null;
        completed_at: Date | null;
        application_id: string;
    }>;
    findByStudentId(studentId: string): Promise<({
        projects: {
            id: string;
            tier: import(".prisma/client").$Enums.user_tier;
            title: string;
            category: string;
        };
        users_contracts_business_idTousers: {
            full_name: string;
            id: string;
        };
    } & {
        id: string;
        created_at: Date | null;
        status: import(".prisma/client").$Enums.contract_status | null;
        deadline: Date;
        business_id: string;
        project_id: string;
        student_id: string;
        agreed_budget: number;
        progress_pct: number | null;
        deliverable_url: string | null;
        deliverable_notes: string | null;
        started_at: Date | null;
        completed_at: Date | null;
        application_id: string;
    })[]>;
    findByBusinessId(businessId: string): Promise<({
        projects: {
            id: string;
            tier: import(".prisma/client").$Enums.user_tier;
            title: string;
            category: string;
        };
        users_contracts_student_idTousers: {
            full_name: string;
            id: string;
            rating_avg: import("@prisma/client-runtime-utils").Decimal;
        };
    } & {
        id: string;
        created_at: Date | null;
        status: import(".prisma/client").$Enums.contract_status | null;
        deadline: Date;
        business_id: string;
        project_id: string;
        student_id: string;
        agreed_budget: number;
        progress_pct: number | null;
        deliverable_url: string | null;
        deliverable_notes: string | null;
        started_at: Date | null;
        completed_at: Date | null;
        application_id: string;
    })[]>;
    update(id: string, payload: any): Promise<{
        id: string;
        created_at: Date | null;
        status: import(".prisma/client").$Enums.contract_status | null;
        deadline: Date;
        business_id: string;
        project_id: string;
        student_id: string;
        agreed_budget: number;
        progress_pct: number | null;
        deliverable_url: string | null;
        deliverable_notes: string | null;
        started_at: Date | null;
        completed_at: Date | null;
        application_id: string;
    }>;
}
