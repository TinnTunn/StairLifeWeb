import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UploadDeliverableDto } from './dto/upload-deliverable.dto';
export declare class ContractsController {
    private readonly contractsService;
    constructor(contractsService: ContractsService);
    create(dto: CreateContractDto, user: any): Promise<{
        data: {
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
        };
        message: string;
    }>;
    getMyContracts(user: any): Promise<{
        data: any;
        message: string;
    }>;
    getById(id: string, user: any): Promise<{
        data: {
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
        };
        message: string;
    }>;
    uploadDeliverable(id: string, dto: UploadDeliverableDto, user: any): Promise<{
        data: {
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
        };
        message: string;
    }>;
    approveDeliverable(id: string, user: any): Promise<{
        data: {
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
        };
        message: string;
    }>;
}
