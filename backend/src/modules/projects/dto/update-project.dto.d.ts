import { ProjectTier } from './create-project.dto';
export declare class UpdateProjectDto {
    title?: string;
    description?: string;
    budget_min?: number;
    budget_max?: number;
    deadline?: string;
    category?: string;
    tier?: ProjectTier;
    skills?: string[];
    deliverables?: string;
}
