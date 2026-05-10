export declare enum AnnouncementTarget {
    ALL = "all",
    STUDENT = "student",
    BUSINESS = "bisnis"
}
export declare class SendAnnouncementDto {
    title: string;
    body: string;
    target: AnnouncementTarget;
}
