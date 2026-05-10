import { SupabaseService } from '../../config/supabase.config';
export declare class ChatService {
    private supabase;
    constructor(supabase: SupabaseService);
    getMessages(contractId: string): Promise<any[]>;
    saveMessage(contractId: string, senderId: string, content: string): Promise<any>;
    markAsRead(contractId: string, userId: string): Promise<void>;
    validateContractAccess(contractId: string, userId: string): Promise<boolean>;
}
