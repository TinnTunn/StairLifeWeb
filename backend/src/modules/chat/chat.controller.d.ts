import { SupabaseService } from '../../config/supabase.config';
declare class SendMessageDto {
    content: string;
}
declare class DirectMessageDto {
    receiver_id: string;
    content: string;
}
export declare class ChatController {
    private supabase;
    constructor(supabase: SupabaseService);
    getMyRooms(user: any): Promise<{
        data: {
            id: any;
            status: any;
            agreed_budget: any;
            projects: {
                id: any;
                title: any;
            }[];
            users_contracts_student_idTousers: {
                id: any;
                full_name: any;
            }[];
            users_contracts_business_idTousers: {
                id: any;
                full_name: any;
            }[];
        }[];
        message: string;
    }>;
    getMessages(contractId: string, user: any): Promise<{
        data: any[];
        message: string;
    }>;
    sendMessage(contractId: string, dto: SendMessageDto, user: any): Promise<{
        data: any;
        message: string;
    }>;
    sendDirectMessage(dto: DirectMessageDto, user: any): Promise<{
        data: any;
        message: string;
    }>;
}
export {};
