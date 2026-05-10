import { SupabaseService } from '../../config/supabase.config';
import { ReviewVerificationDto } from './dto/review-verification.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';
import { SendAnnouncementDto } from './dto/send-announcement.dto';
export declare class AdminService {
    private supabaseService;
    constructor(supabaseService: SupabaseService);
    getStats(): Promise<{
        data: {
            total_users: number;
            total_projects: number;
            active_projects: number;
            pending_verifications: number;
            active_disputes: number;
        };
        message: string;
    }>;
    getAllUsers(role?: string): Promise<{
        data: {
            id: any;
            full_name: any;
            email: any;
            role: any;
            tier: any;
            is_verified: any;
            created_at: any;
        }[];
        message: string;
    }>;
    suspendUser(userId: string, adminId: string): Promise<{
        data: {
            id: any;
            full_name: any;
            email: any;
            role: any;
        };
        message: string;
    }>;
    getPendingVerifications(status?: string): Promise<{
        data: any[];
        message: string;
    }>;
    reviewVerification(verificationId: string, dto: ReviewVerificationDto, adminId: string): Promise<{
        data: any;
        message: string;
    }>;
    getAllDisputes(status?: string): Promise<{
        data: any[];
        message: string;
    }>;
    resolveDispute(disputeId: string, dto: ResolveDisputeDto, adminId: string): Promise<{
        data: any;
        message: string;
    }>;
    getAllProjects(status?: string): Promise<{
        data: any[];
        message: string;
    }>;
    sendAnnouncement(dto: SendAnnouncementDto, adminId: string): Promise<{
        data: any;
        message: string;
    }>;
    getAnnouncements(): Promise<{
        data: any[];
        message: string;
    }>;
}
