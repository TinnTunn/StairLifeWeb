import { ProjectsRepository } from './projects.repository';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FilterProjectDto } from './dto/filter-project.dto';
export declare class ProjectsService {
    private projectsRepository;
    constructor(projectsRepository: ProjectsRepository);
    getAllProjects(filter: FilterProjectDto): Promise<{
        data: ({
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
        })[];
        message: string;
    }>;
    getProjectById(id: string): Promise<{
        data: {
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
        };
        message: string;
    }>;
    createProject(dto: CreateProjectDto, businessId: string): Promise<{
        data: {
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
        };
        message: string;
    }>;
    updateProject(id: string, dto: UpdateProjectDto, businessId: string): Promise<{
        data: {
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
        };
        message: string;
    }>;
    deleteProject(id: string, businessId: string): Promise<{
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
    getMyProjects(businessId: string): Promise<{
        data: {
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
        }[];
        message: string;
    }>;
}
