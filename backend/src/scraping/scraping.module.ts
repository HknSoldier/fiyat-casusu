import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { ScrapingService } from './scraping.service';
import { ScrapingController } from './scraping.controller';
import { TrendyolScraper } from './platforms/trendyol.scraper';
import { HepsiburadaScraper } from './platforms/hepsiburada.scraper';
import { N11Scraper } from './platforms/n11.scraper';
import { AmazonScraper } from './platforms/amazon.scraper';
import { ProductsModule } from '../products/products.module';

const hasRedis = !!(process.env.REDIS_URL);

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
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