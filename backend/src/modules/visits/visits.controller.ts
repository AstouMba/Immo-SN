import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Public } from '../../common/public.decorator.js';
import { Roles } from '../../common/roles.decorator.js';
import { VisitsService } from './visits.service.js';

class CreateVisitDto {
  @IsString() @IsNotEmpty() propertyId!: string;
  @IsString() @IsNotEmpty() name!: string;
  @IsEmail() email!: string;
  @IsOptional() @IsString() phone?: string;
  // DateTime côté DB, on accepte une string ISO et on convertit
  @IsOptional() @Type(() => Date) @IsDate() preferredDate?: Date;
  @IsOptional() @IsString() preferredTime?: string;
  @IsOptional() @IsString() notes?: string;
}

class UpdateVisitStatusDto {
  @IsIn(['pending', 'confirmed', 'cancelled', 'completed']) status!:
    | 'pending'
    | 'confirmed'
    | 'cancelled'
    | 'completed';
}

@Controller('visits')
export class VisitsController {
  constructor(private readonly visits: VisitsService) {}

  @Roles('admin')
  @Get()
  findAll() {
    return this.visits.findAll();
  }

  @Public()
  @Post()
  create(@Body() dto: CreateVisitDto) {
    return this.visits.create(dto);
  }

  @Roles('admin')
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateVisitStatusDto) {
    return this.visits.updateStatus(id, dto.status);
  }
}