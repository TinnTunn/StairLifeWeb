"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const supabase_config_1 = require("../../config/supabase.config");
const bcrypt = __importStar(require("bcryptjs"));
let AuthService = class AuthService {
    constructor(supabaseService, jwtService) {
        this.supabaseService = supabaseService;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const supabase = this.supabaseService.getClient();
        const { data: existing } = await supabase
            .from('users')
            .select('id')
            .eq('email', dto.email)
            .single();
        if (existing) {
            throw new common_1.ConflictException('Email sudah terdaftar');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 12);
        const { data: user, error } = await supabase
            .from('users')
            .insert({
            full_name: dto.full_name,
            email: dto.email,
            password_hash: hashedPassword,
            role: dto.role,
            tier: 'pemula',
            is_verified: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
            .select('id, full_name, email, role, tier, is_verified')
            .single();
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        const token = this._generateToken(user);
        return {
            data: { user, token },
            message: 'Pendaftaran berhasil',
        };
    }
    async login(dto) {
        const supabase = this.supabaseService.getClient();
        const { data: user } = await supabase
            .from('users')
            .select('id, full_name, email, role, tier, is_verified, password_hash')
            .eq('email', dto.email)
            .single();
        if (!user) {
            throw new common_1.UnauthorizedException('Email atau password salah');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Email atau password salah');
        }
        const { password_hash, ...userWithoutPassword } = user;
        const token = this._generateToken(userWithoutPassword);
        return {
            data: { user: userWithoutPassword, token },
            message: 'Login berhasil',
        };
    }
    _generateToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        return this.jwtService.sign(payload);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_config_1.SupabaseService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map