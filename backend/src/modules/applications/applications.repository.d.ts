import { PrismaService } from '../../config/prisma.service';
export declare class ApplicationsRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(payload: any): Promise<{
        id: string;
        created_at: Date | null;
        status: import(".prisma/client").$Enums.application_status | null;
        cover_letter: string;
        estimated_completion: Date;
        offered_budget: number | null;
        project_id: string;
        student_id: string;
    }>;
    findByStudentId(studentId: string): Promise<({
        projects: {
            users: {
                full_name: string;
                id: string;
            };
            id: string;
            tier: import(".prisma/client").$Enums.user_tier;
            status: import(".prisma/client").$Enums.project_status;
            title: string;
            budget_min: number;
            budget_max: number;
            category: string;
        };
    } & {
        id: string;
        created_at: Date | null;
        status: import(".prisma/client").$Enums.application_status | null;
        cover_letter: string;
        estimated_completion: Date;
        offered_budget: number | null;
        project_id: string;
        student_id: string;
    })[]>;
    findByProjectId(projectId: string): Promise<({
        users: {
            full_name: string;
            id: string;
            tier: import(".prisma/client").$Enums.user_tier;
            is_verified: boolean;
            skills: string[];
            rating_avg: import("@prisma/client-runtime-utils").Decimal;
            total_projects: number;
        };
    } & {
        id: string;
        created_at: Date | null;
        status: import(".prisma/client").$Enums.application_status | null;
        cover_letter: string;
        estimated_completion: Date;
        offered_budget: number | null;
        project_id: string;
        student_id: string;
    })[]>;
    findById(id: string): Promise<{
        id: string;
        created_at: Date | null;
        status: import(".prisma/client").$Enums.application_status | null;
        cover_letter: string;
        estimated_completion: Date;
        offered_budget: number | null;
        project_id: string;
        student_id: string;
    }>;
    findByProjectAndStudent(projectId: string, studentId: string): Promise<{
        id: string;
    }>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        created_at: Date | null;
        status: import(".prisma/client").$Enums.application_status | null;
        cover_letter: string;
        estimated_completion: Date;
        offered_budget: number | null;
        project_id: string;
        student_id: string;
    }>;
}
