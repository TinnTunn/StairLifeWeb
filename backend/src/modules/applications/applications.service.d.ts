import { ApplicationsRepository } from './applications.repository';
import { ProjectsRepository } from '../projects/projects.repository';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { SupabaseService } from '../../config/supabase.config';
export declare class ApplicationsService {
    private applicationsRepository;
    private projectsRepository;
    private supabaseService;
    constructor(applicationsRepository: ApplicationsRepository, projectsRepository: ProjectsRepository, supabaseService: SupabaseService);
    applyToProject(dto: CreateApplicationDto, studentId: string): Promise<{
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
    getMyApplications(studentId: string): Promise<{
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
    getProjectApplications(projectId: string, businessId: string): Promise<{
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
    updateApplicationStatus(id: string, dto: UpdateApplicationStatusDto, businessId: string): Promise<{
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
