import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { PrismaService } from '../../database/prisma.service.js';
import type { CreatePropertyDto, ListPropertiesQueryDto, UpdatePropertyDto } from './properties.dto.js';

const parseList = (value: string) => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const MAX_PROPERTY_IMAGES = 3;
const toUploadedPaths = (files: Express.Multer.File[]) => files.map((file) => `/uploads/${file.filename}`);
const UPLOADS_DIR = join(process.cwd(), 'uploads');
const normalizeUploadReference = (value: string) => {
  const marker = '/uploads/';
  const index = value.indexOf(marker);
  return index >= 0 ? value.slice(index) : value;
};
const isLocalUpload = (value: string) => value.startsWith('/uploads/');
const removeLocalUpload = async (value: string) => {
  if (!isLocalUpload(value)) return;
  const filePath = join(UPLOADS_DIR, value.slice('/uploads/'.length));
  try {
    await unlink(filePath);
  } catch {
    // Ignore missing files or cleanup errors; the DB state remains the source of truth.
  }
};
const removeMissingUploads = async (before: string[], after: string[]) => {
  const removed = before.filter((value) => !after.includes(value));
  await Promise.all(removed.map(removeLocalUpload));
};

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  private serialize(property: Record<string, unknown>) {
    return {
      ...property,
      images: parseList(String(property.images ?? '[]')),
      features: parseList(String(property.features ?? '[]')),
    };
  }

  async findAll(query: ListPropertiesQueryDto) {
    const where = {
      ...(query.all ? {} : query.available === undefined ? { available: true } : { available: query.available }),
      ...(query.city ? { city: { contains: query.city } } : {}),
      ...(query.type ? { type: query.type } : {}),
      ...(query.transactionType ? { transactionType: query.transactionType } : {}),
      ...(query.minPrice !== undefined || query.maxPrice !== undefined ? { price: { ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}), ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}) } } : {}),
      ...(query.minSurface !== undefined ? { surface: { gte: query.minSurface } } : {}),
      ...(query.rooms !== undefined ? { rooms: { gte: query.rooms } } : {}),
      ...(query.search ? { OR: [{ title: { contains: query.search } }, { description: { contains: query.search } }] } : {}),
    };
    const total = await this.prisma.property.count({ where });
    const items = query.all
      ? await this.prisma.property.findMany({ where, orderBy: { createdAt: 'desc' } })
      : await this.prisma.property.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      });

    return {
      data: items.map((item) => this.serialize(item as unknown as Record<string, unknown>)),
      meta: {
        page: query.all ? 1 : query.page,
        limit: query.all ? total : query.limit,
        total,
        totalPages: query.all ? 1 : Math.max(1, Math.ceil(total / query.limit)),
      },
    };
  }

  async findOne(id: string) {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property || !property.available) throw new NotFoundException('Bien introuvable');
    return this.serialize(property as unknown as Record<string, unknown>);
  }

  async create(dto: CreatePropertyDto, ownerId: string, imageFiles: Express.Multer.File[]) {
    const uploadedImages = toUploadedPaths(imageFiles);
    const images = [...(dto.images ?? []).map(normalizeUploadReference), ...uploadedImages];
    if (images.length < 1) throw new BadRequestException('Ajoutez au moins une photo du bien');
    if (images.length > MAX_PROPERTY_IMAGES) throw new BadRequestException(`Maximum ${MAX_PROPERTY_IMAGES} photos autorisées`);
    try {
      const property = await this.prisma.property.create({
        data: {
          ...dto,
          images: JSON.stringify(images),
          features: JSON.stringify(dto.features ?? []),
          ownerId,
        },
      });
      return this.serialize(property as unknown as Record<string, unknown>);
    } catch (error) {
      await Promise.all(uploadedImages.map(removeLocalUpload));
      throw error;
    }
  }

  async update(id: string, dto: UpdatePropertyDto, imageFiles: Express.Multer.File[]) {
    const exists = await this.prisma.property.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Bien introuvable');
    const existingImages = parseList(String(exists.images ?? '[]')).map(normalizeUploadReference);
    const uploadedImages = toUploadedPaths(imageFiles);
    const images = [...(dto.images ?? existingImages).map(normalizeUploadReference), ...uploadedImages];
    if (images.length < 1) throw new BadRequestException('Ajoutez au moins une photo du bien');
    if (images.length > MAX_PROPERTY_IMAGES) throw new BadRequestException(`Maximum ${MAX_PROPERTY_IMAGES} photos autorisées`);
    const { images: _images, features, ...scalarFields } = dto;
    try {
      const property = await this.prisma.property.update({
        where: { id },
        data: {
          ...scalarFields,
          images: JSON.stringify(images),
          ...(features ? { features: JSON.stringify(features) } : {}),
        },
      });
      await removeMissingUploads(existingImages, images);
      return this.serialize(property as unknown as Record<string, unknown>);
    } catch (error) {
      await Promise.all(uploadedImages.map(removeLocalUpload));
      throw error;
    }
  }

  async remove(id: string) {
    const exists = await this.prisma.property.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Bien introuvable');
    await this.prisma.property.delete({ where: { id } });
    await Promise.all(parseList(String(exists.images ?? '[]')).map(removeLocalUpload));
    return { deleted: true, id };
  }
}
