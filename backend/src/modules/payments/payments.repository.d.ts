import { PrismaService } from '../../config/prisma.service';
export declare class PaymentsRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(payload: any): Promise<{
        id: string;
        created_at: Date | null;
        status: import(".prisma/client").$Enums.payment_status | null;
        amount: number;
        platform_fee: number;
        net_amount: number;
        held_at: Date | null;
        released_at: Date | null;
        contract_id: string;
        payer_id: string | null;
        payee_id: string | null;
    }>;
    findById(id: string): Promise<{
        contracts: {
            projects: {
                id: string;
                title: string;
            };
            id: string;
            status: import(".prisma/client").$Enums.contract_status;
            agreed_budget: number;
        };
    } & {
        id: string;
        created_at: Date | null;
        status: import(".prisma/client").$Enums.payment_status | null;
        amount: number;
        platform_fee: number;
        net_amount: number;
        held_at: Date | null;
        released_at: Date | null;
        contract_id: string;
        payer_id: string | null;
        payee_id: string | null;
    }>;
    findByContractId(contractId: string): Promise<{
        id: string;
        created_at: Date | null;
        status: import(".prisma/client").$Enums.payment_status | null;
        amount: number;
        platform_fee: number;
        net_amount: number;
        held_at: Date | null;
        released_at: Date | null;
        contract_id: string;
        payer_id: string | null;
        payee_id: string | null;
    }>;
    findByUserId(userId: string): Promise<({
        contracts: {
            projects: {
                id: string;
                title: string;
            };
            id: string;
            agreed_budget: number;
        };
    } & {
        id: string;
        created_at: Date | null;
        status: import(".prisma/client").$Enums.payment_status | null;
        amount: number;
        platform_fee: number;
        net_amount: number;
        held_at: Date | null;
        released_at: Date | null;
        contract_id: string;
        payer_id: string | null;
        payee_id: string | null;
    })[]>;
    update(id: string, payload: any): Promise<{
        id: string;
        created_at: Date | null;
        status: import(".prisma/client").$Enums.payment_status | null;
        amount: number;
        platform_fee: number;
        net_amount: number;
        held_at: Date | null;
        released_at: Date | null;
        contract_id: string;
        payer_id: string | null;
        payee_id: string | null;
    }>;
}
