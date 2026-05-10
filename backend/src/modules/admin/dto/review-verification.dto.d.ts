export declare enum VerificationAction {
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare class ReviewVerificationDto {
    status: VerificationAction;
    rejection_reason?: string;
}
