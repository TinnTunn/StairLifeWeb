import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    holdEscrow(dto: CreatePaymentDto, user: any): Promise<{
        data: {
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
        };
        message: string;
    }>;
    releaseEscrow(id: string, user: any): Promise<{
        data: {
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
        };
        message: string;
    }>;
    getMyPayments(user: any): Promise<{
        data: ({
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
        })[];
        message: string;
    }>;
    getByContract(contractId: string, user: any): Promise<{
        data: {
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
        };
        message: string;
    }>;
}
