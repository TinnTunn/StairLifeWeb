export declare enum ProjectTier {
    PEMULA = "pemula",
    MENENGAH = "menengah",
    MAHIR = "mahir"
}
export declare class CreateProjectDto {
    title: string;
    description: string;
    budget_min: number;
    budget_max: number;
    deadline: string;
    category: string;
    tier: ProjectTier;
    skills?: string[];
    deliverables?: string;
}
