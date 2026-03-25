import { IsString, IsNumber, IsOptional, IsEnum, IsUrl } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsUrl()
  url: string;

  @IsEnum(['trendyol', 'hepsiburada', 'n11', 'amazon'])
  platform: 'trendyol' | 'hepsiburada' | 'n11' | 'amazon';
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;
}