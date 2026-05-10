export declare enum ApplicationStatus {
    PENDING = "pending",
    SHORTLISTED = "shortlisted",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare class UpdateApplicationStatusDto {
    status: ApplicationStatus;
}
