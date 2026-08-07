import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class InquiriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() { return this.prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' } }); }

  create(data: { name: string; email: string; phone?: string; message: string; propertyId?: string }) {
    return this.prisma.inquiry.create({ data });
  }

  async updateStatus(id: string, status: string) {
    const exists = await this.prisma.inquiry.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Message introuvable');
    return this.prisma.inquiry.update({ where: { id }, data: { status } });
  }
}
