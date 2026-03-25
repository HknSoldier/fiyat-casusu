import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScrapingService } from './scraping.service';
import { ScrapingController } from './scraping.controller';
import { TrendyolScraper } from './platforms/trendyol.scraper';
import { HepsiburadaScraper } from './platforms/hepsiburada.scraper';
import { N11Scraper } from './platforms/n11.scraper';
import { AmazonScraper } from './platforms/amazon.scraper';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ...(process.env.REDIS_URL ? [
      BullModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async () => ({
          connection: {
            url: process.env.REDIS_URL,
            tls: { rejectUnauthorized: false },
            retryStrategy: (times) => Math.min(times * 50, 2000),
            maxRetriesPerRequest: 3,
          },
        }),
      }),
      BullModule.registerQueue({ name: 'scraping' }),
    ] : []),
    ProductsModule,
  ],
  controllers: [ScrapingController],
  providers: [
    ScrapingService,
    TrendyolScraper,
    HepsiburadaScraper,
    N11Scraper,
    AmazonScraper,
  ],
  exports: [ScrapingService],
})
export class ScrapingModule {}