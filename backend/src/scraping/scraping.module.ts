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
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // Support REDIS_URL from Render or custom REDIS_HOST/REDIS_PORT
        const redisUrl = process.env.REDIS_URL || configService.get('REDIS_URL');
        
        if (redisUrl) {
          // Use REDIS_URL directly
          return {
            connection: {
              url: redisUrl,
            },
          };
        }
        
        // Fallback to individual REDIS_HOST/REDIS_PORT (or disable Redis)
        const redisHost = configService.get('REDIS_HOST');
        if (!redisHost) {
          // Redis not configured - return dummy connection to prevent crash
          return {
            connection: {
              host: 'localhost',
              port: 6379,
              enableReadyCheck: false,
              maxRetriesPerRequest: 1,
            },
          };
        }
        
        return {
          connection: {
            host: redisHost,
            port: parseInt(configService.get('REDIS_PORT') || '6379'),
          },
        };
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue({ name: 'scraping' }),
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