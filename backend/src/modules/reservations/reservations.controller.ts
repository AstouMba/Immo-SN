import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Public } from '../../common/public.decorator.js';
import { Roles } from '../../common/roles.decorator.js';
import { ReservationsService } from './reservations.service.js';

class CreateReservationDto {
  @IsString() @IsNotEmpty() propertyId!: string;
  @IsString() @IsNotEmpty() name!: string;
  @IsEmail() email!: string;
  @IsOptional() @IsString() phone?: string;
  @IsDate() @Type(() => Date) startDate!: Date;
  @IsDate() @Type(() => Date) endDate!: Date;
  @IsOptional() @IsInt() @Min(1) numberOfGuests?: number;
  @IsOptional() @IsString() notes?: string;
}

class UpdateReservationStatusDto {
  @IsIn(['pending', 'confirmed', 'cancelled', 'completed']) status!:
    | 'pending'
    | 'confirmed'
    | 'cancelled'
    | 'completed';
}

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservations: ReservationsService) {}

  @Roles('admin')
  @Get()
  findAll() {
    return this.reservations.findAll();
  }

  @Public()
  @Post()
  create(@Body() dto: CreateReservationDto) {
    return this.reservations.create(dto);
  }

  @Roles('admin')
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateReservationStatusDto) {
    return this.reservations.updateStatus(id, dto.status);
  }
}
