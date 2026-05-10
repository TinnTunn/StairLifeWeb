import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        data: {
            user: {
                id: any;
                full_name: any;
                email: any;
                role: any;
                tier: any;
                is_verified: any;
            };
            token: string;
        };
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        data: {
            user: {
                id: any;
                full_name: any;
                email: any;
                role: any;
                tier: any;
                is_verified: any;
            };
            token: string;
        };
        message: string;
    }>;
}
