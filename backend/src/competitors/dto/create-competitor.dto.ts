import { IsString, IsOptional, IsEnum, IsUrl } from 'class-validator';

export class CreateCompetitorDto {
  @IsString()
  name: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsEnum(['trendyol', 'hepsiburada', 'n11', 'amazon'])
  platform?: 'trendyol' | 'hepsiburada' | 'n11' | 'amazon';
}