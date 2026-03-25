import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertRule } from '../database/entities/alert-rule.entity';
import { Alert } from '../database/entities/alert.entity';
import { Product } from '../database/entities/product.entity';
import { Competitor } from '../database/entities/competitor.entity';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlertRule, Alert, Product, Competitor]),
    NotificationsModule,
  ],
  controllers: [AlertsController],
  providers: [AlertsService],
  exports: [AlertsService],
})
export class AlertsModule {}