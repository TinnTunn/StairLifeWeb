import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Cek apakah endpoint butuh role tertentu
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Kalau tidak ada requirement → allow
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    
    // Cek apakah user punya role yang diperlukan
    const hasRole = requiredRoles.includes(user?.role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Akses ditolak. Diperlukan role: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}