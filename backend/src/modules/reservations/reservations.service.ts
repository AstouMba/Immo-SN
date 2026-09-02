import { Injectable, NotFoundException } from '@nestjs/common';
import type { ReservationStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.reservation.findMany({
      include: { property: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(data: {
    propertyId: string;
    name: string;
    email: string;
    phone?: string;
    startDate: Date;
    endDate: Date;
    numberOfGuests?: number;
    notes?: string;
  }) {
    return this.prisma.reservation.create({ data });
  }

  async updateStatus(id: string, status: ReservationStatus) {
    const exists = await this.prisma.reservation.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Réservation introuvable');
    return this.prisma.reservation.update({ where: { id }, data: { status } });
  }
}
