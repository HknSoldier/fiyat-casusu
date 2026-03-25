import { IsString, IsEnum, IsObject, IsArray, IsBoolean, IsOptional } from 'class-validator';

export class CreateAlertRuleDto {
  @IsString()
  name: string;

  @IsEnum(['price_drop', 'price_increase', 'stock_out', 'stock_low', 'competitor_add', 'competitor_remove'])
  type: 'price_drop' | 'price_increase' | 'stock_out' | 'stock_low' | 'competitor_add' | 'competitor_remove';

  @IsObject()
  condition: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  notificationChannels?: { type: string; config?: Record<string, any> }[];
}