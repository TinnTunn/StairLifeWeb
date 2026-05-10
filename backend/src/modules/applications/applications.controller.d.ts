import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
export declare class ApplicationsController {
    private readonly applicationsService;
    constructor(applicationsService: ApplicationsService);
    apply(dto: CreateApplicationDto, user: any): Promise<{
        data: {
            id: string;
            created_at: Date | null;
            status: import(".prisma/client").$Enums.application_status | null;
            cover_letter: string;
            estimated_completion: Date;
            offered_budget: number | null;
            project_id: string;
            student_id: string;
        };
        message: string;
    }>;
    getMyApplications(user: any): Promise<{
        data: ({
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
        })[];
        message: string;
    }>;
    getProjectApplications(projectId: string, user: any): Promise<{
        data: ({
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
        })[];
        message: string;
    }>;
    updateStatus(id: string, dto: UpdateApplicationStatusDto, user: any): Promise<{
        data: {
            id: string;
            created_at: Date | null;
            status: import(".prisma/client").$Enums.application_status | null;
            cover_letter: string;
            estimated_completion: Date;
            offered_budget: number | null;
            project_id: string;
            student_id: string;
        };
        message: string;
    }>;
}
