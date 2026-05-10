import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        tier: true,
        is_verified: true,
        avatar_url: true,
        bio: true,
        university: true,
        major: true,
        semester: true,
        skills: true,
        portfolio_url: true,
        rating_avg: true,
        total_projects: true,
        created_at: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        tier: true,
        is_verified: true,
      },
    });
  }

  async update(id: string, payload: any) {
    return this.prisma.users.update({
      where: { id },
      data: { ...payload, updated_at: new Date() },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        tier: true,
        is_verified: true,
        avatar_url: true,
        bio: true,
        university: true,
        major: true,
        semester: true,
        skills: true,
        portfolio_url: true,
      },
    });
  }

  async findAll() {
    return this.prisma.users.findMany({
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        tier: true,
        is_verified: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }
}