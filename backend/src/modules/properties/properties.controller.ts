import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CurrentUser } from '../../common/current-user.decorator.js';
import { Public } from '../../common/public.decorator.js';
import { Roles } from '../../common/roles.decorator.js';
import type { AuthUser } from '../../common/auth.types.js';
import { CreatePropertyDto, ListPropertiesQueryDto, UpdatePropertyDto } from './properties.dto.js';
import { PropertiesService } from './properties.service.js';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'node:path';
import { mkdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

const MAX_PROPERTY_IMAGES = 3;
const UPLOAD_DIR = join(process.cwd(), 'uploads');
mkdirSync(UPLOAD_DIR, { recursive: true });

const supportedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);

const uploadOptions = {
  storage: diskStorage({
    destination: UPLOAD_DIR,
    filename: (_request: Express.Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
      const extension = extname(file.originalname) || '';
      callback(null, `${Date.now()}-${randomUUID()}${extension}`);
    },
  }),
  fileFilter: (_request: Express.Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    if (!supportedImageTypes.has(file.mimetype)) {
      callback(new BadRequestException('Formats acceptés : JPG, PNG, WEBP, GIF, AVIF') as unknown as Error, false);
      return;
    }
    callback(null, true);
  },
  limits: {
    files: MAX_PROPERTY_IMAGES,
    fileSize: 10 * 1024 * 1024,
  },
};

@Controller('properties')
export class PropertiesController {
  constructor(private readonly properties: PropertiesService) {}

  @Public()
  @Get()
  findAll(@Query() query: ListPropertiesQueryDto) {
    return this.properties.findAll(query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.properties.findOne(id);
  }

  @Roles('admin')
  @UseInterceptors(FilesInterceptor('imageFiles', MAX_PROPERTY_IMAGES, uploadOptions))
  @Post()
  create(@Body() dto: CreatePropertyDto, @UploadedFiles() imageFiles: Express.Multer.File[], @CurrentUser() user: AuthUser) {
    return this.properties.create(dto, user.sub, imageFiles ?? []);
  }

  @Roles('admin')
  @UseInterceptors(FilesInterceptor('imageFiles', MAX_PROPERTY_IMAGES, uploadOptions))
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePropertyDto, @UploadedFiles() imageFiles: Express.Multer.File[]) {
    return this.properties.update(id, dto, imageFiles ?? []);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.properties.remove(id);
  }
}
