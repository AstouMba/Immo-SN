import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Public } from '../../common/public.decorator.js';
import { Roles } from '../../common/roles.decorator.js';
import { InquiriesService } from './inquiries.service.js';

class CreateInquiryDto {
  @IsString() @IsNotEmpty() name!: string;
  @IsEmail() email!: string;
  @IsOptional() @IsString() phone?: string;
  @IsString() @IsNotEmpty() message!: string;
  @IsOptional() @IsString() propertyId?: string;
}

class UpdateInquiryStatusDto {
  @IsIn(['pending', 'contacted', 'closed']) status!: 'pending' | 'contacted' | 'closed';
}

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiries: InquiriesService) {}

  @Roles('admin')
  @Get()
  findAll() {
    return this.inquiries.findAll();
  }

  @Public()
  @Post()
  create(@Body() dto: CreateInquiryDto) {
    return this.inquiries.create(dto);
  }

  @Roles('admin')
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateInquiryStatusDto) {
    return this.inquiries.updateStatus(id, dto.status);
  }
}