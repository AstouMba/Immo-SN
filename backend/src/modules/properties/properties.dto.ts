import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

const propertyTypes = ['apartment', 'house', 'villa', 'office', 'land', 'commercial'] as const;
const transactionTypes = ['rent', 'sale'] as const;
const currencyTypes = ['FCFA', 'EUR', 'USD'] as const;

const parseStringArray = ({ value }: { value: unknown }) => {
  if (value == null || value === '') return undefined;
  if (Array.isArray(value)) return value.map((entry) => String(entry).trim()).filter(Boolean);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map((entry) => String(entry).trim()).filter(Boolean);
    } catch {
      return value.split(',').map((entry) => entry.trim()).filter(Boolean);
    }
  }
  return undefined;
};

export class CreatePropertyDto {
  @IsString() @IsNotEmpty() title!: string;
  @IsString() @IsNotEmpty() description!: string;
  @Type(() => Number) @IsInt() @Min(0) price!: number;
  @IsOptional() @IsIn(currencyTypes) currency?: (typeof currencyTypes)[number];
  @IsIn(propertyTypes) type!: (typeof propertyTypes)[number];
  @IsIn(transactionTypes) transactionType!: (typeof transactionTypes)[number];
  @Type(() => Number) @IsInt() @Min(0) surface!: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) rooms?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) bedrooms?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) bathrooms?: number;
  @IsString() @IsNotEmpty() address!: string;
  @IsString() @IsNotEmpty() city!: string;
  @IsOptional() @IsString() neighborhood?: string;
  @IsOptional() @IsString() postalCode?: string;
  @IsOptional() @Type(() => Number) latitude?: number;
  @IsOptional() @Type(() => Number) longitude?: number;
  @IsOptional() @Transform(parseStringArray) @IsArray() @IsString({ each: true }) images?: string[];
  @IsOptional() @Transform(parseStringArray) @IsArray() @IsString({ each: true }) features?: string[];
  @IsOptional() @IsBoolean() available?: boolean;
  @IsOptional() @IsBoolean() featured?: boolean;
}
export class UpdatePropertyDto {
  @IsOptional() @IsString() @IsNotEmpty() title?: string;
  @IsOptional() @IsString() @IsNotEmpty() description?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) price?: number;
  @IsOptional() @IsIn(currencyTypes) currency?: (typeof currencyTypes)[number];
  @IsOptional() @IsIn(propertyTypes) type?: (typeof propertyTypes)[number];
  @IsOptional() @IsIn(transactionTypes) transactionType?: (typeof transactionTypes)[number];
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) surface?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) rooms?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) bedrooms?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) bathrooms?: number;
  @IsOptional() @IsString() @IsNotEmpty() address?: string;
  @IsOptional() @IsString() @IsNotEmpty() city?: string;
  @IsOptional() @IsString() neighborhood?: string;
  @IsOptional() @IsString() postalCode?: string;
  @IsOptional() @Type(() => Number) latitude?: number;
  @IsOptional() @Type(() => Number) longitude?: number;
  @IsOptional() @Transform(parseStringArray) @IsArray() @IsString({ each: true }) images?: string[];
  @IsOptional() @Transform(parseStringArray) @IsArray() @IsString({ each: true }) features?: string[];
  @IsOptional() @IsBoolean() available?: boolean;
  @IsOptional() @IsBoolean() featured?: boolean;
}

export class ListPropertiesQueryDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsIn(propertyTypes) type?: (typeof propertyTypes)[number];
  @IsOptional() @IsIn(transactionTypes) transactionType?: (typeof transactionTypes)[number];
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit = 24;
  @IsOptional() @Type(() => Boolean) @IsBoolean() available?: boolean;
  @IsOptional() @Type(() => Boolean) @IsBoolean() all?: boolean;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) minPrice?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) maxPrice?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) minSurface?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) rooms?: number;
}