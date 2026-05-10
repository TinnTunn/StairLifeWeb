import { PaymentsRepository } from './payments.repository';
import { ContractsRepository } from '../contracts/contracts.repository';
import { CreatePaymentDto } from './dto/create-payment.dto';
export declare class PaymentsService {
    private paymentsRepository;
    private contractsRepository;
    constructor(paymentsRepository: PaymentsRepository, contractsRepository: ContractsRepository);
    holdEscrow(dto: CreatePaymentDto, businessId: string): Promise<{
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
    releaseEscrow(paymentId: string, businessId: string): Promise<{
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
    getMyPayments(userId: string): Promise<{
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
    getPaymentByContract(contractId: string, userId: string): Promise<{
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
