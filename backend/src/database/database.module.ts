import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Company,
  User,
  Product,
  Competitor,
  PriceHistory,
  StockHistory,
  AlertRule,
  Alert,
  Category,
  ProductMatch,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      User,
      Product,
      Competitor,
      PriceHistory,
      StockHistory,
      AlertRule,
      Alert,
      Category,
      ProductMatch,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}