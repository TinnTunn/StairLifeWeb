export declare enum UserRole {
    STUDENT = "mahasiswa",
    BUSINESS = "bisnis",
    ADMIN = "admin"
}
export declare class RegisterDto {
    full_name: string;
    email: string;
    password: string;
    role: UserRole;
}
