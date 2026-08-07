import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class VisitsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() { return this.prisma.visit.findMany({ include: { property: { select: { title: true } } }, orderBy: { createdAt: 'desc' } }); }

  create(data: { propertyId: string; name: string; email: string; phone?: string; preferredDate?: string; preferredTime?: string; notes?: string }) {
    return this.prisma.visit.create({ data });
  }

  async updateStatus(id: string, status: string) {
    const exists = await this.prisma.visit.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Demande de visite introuvable');
    return this.prisma.visit.update({ where: { id }, data: { status } });
  }
}
