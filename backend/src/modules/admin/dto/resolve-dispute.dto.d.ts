export declare enum DisputeAction {
    UNDER_REVIEW = "underReview",
    RESOLVED = "resolved"
}
export declare class ResolveDisputeDto {
    status: DisputeAction;
    admin_notes?: string;
}
