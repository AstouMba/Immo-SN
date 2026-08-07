import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service.js';
import type { AuthUser } from '../../common/auth.types.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  private serializeUser(user: { id: string; email: string; fullName: string; phone: string | null; role: string }) {
    return { id: user.id, email: user.email, fullName: user.fullName, phone: user.phone, role: user.role };
  }

  private async responseFor(user: { id: string; email: string; fullName: string; phone: string | null; role: string }) {
    const payload: AuthUser = { sub: user.id, email: user.email, role: user.role === 'admin' ? 'admin' : 'user' };
    return {
      accessToken: await this.jwt.signAsync(payload),
      user: this.serializeUser(user),
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    return this.responseFor(user);
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Session invalide');
    return this.serializeUser(user);
  }

  async ensureAdmin(email: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
    const hashedPassword = await bcrypt.hash(password, 12);
    if (existing) {
      return this.prisma.user.update({
        where: { id: existing.id },
        data: { password: hashedPassword, role: 'admin', fullName: existing.fullName || 'Administrateur' },
      });
    }
    return this.prisma.user.create({
      data: { email: normalizedEmail, password: hashedPassword, role: 'admin', fullName: 'Administrateur' },
    });
  }

  async register(email: string, password: string, fullName: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) throw new ConflictException('Cet email est déjà utilisé');
    const user = await this.prisma.user.create({
      data: { email: normalizedEmail, password: await bcrypt.hash(password, 12), fullName, role: 'user' },
    });
    return this.responseFor(user);
  }
}
