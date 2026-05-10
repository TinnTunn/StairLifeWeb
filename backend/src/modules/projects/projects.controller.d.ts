import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FilterProjectDto } from './dto/filter-project.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    getAll(filter: FilterProjectDto): Promise<{
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
    getMyProjects(user: any): Promise<{
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
    getById(id: string): Promise<{
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
    create(dto: CreateProjectDto, user: any): Promise<{
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
    update(id: string, dto: UpdateProjectDto, user: any): Promise<{
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
    delete(id: string, user: any): Promise<{
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
