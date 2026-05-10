import { AdminService } from './admin.service';
import { ReviewVerificationDto } from './dto/review-verification.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';
import { SendAnnouncementDto } from './dto/send-announcement.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
    suspendUser(id: string, user: any): Promise<{
        data: {
            id: any;
            full_name: any;
            email: any;
            role: any;
        };
        message: string;
    }>;
    getVerifications(status?: string): Promise<{
        data: any[];
        message: string;
    }>;
    reviewVerification(id: string, dto: ReviewVerificationDto, user: any): Promise<{
        data: any;
        message: string;
    }>;
    getDisputes(status?: string): Promise<{
        data: any[];
        message: string;
    }>;
    resolveDispute(id: string, dto: ResolveDisputeDto, user: any): Promise<{
        data: any;
        message: string;
    }>;
    getAllProjects(status?: string): Promise<{
        data: any[];
        message: string;
    }>;
    sendAnnouncement(dto: SendAnnouncementDto, user: any): Promise<{
        data: any;
        message: string;
    }>;
    getAnnouncements(): Promise<{
        data: any[];
        message: string;
    }>;
}
