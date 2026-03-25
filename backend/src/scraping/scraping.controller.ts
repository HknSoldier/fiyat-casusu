import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('scraping')
@UseGuards(JwtAuthGuard)
export class ScrapingController {
  constructor(private scrapingService: ScrapingService) {}

  @Post('scrape')
  async scrapeProduct(@Body() body: { url: string; platform: string }) {
    return this.scrapingService.scrapeProduct(body.url, body.platform);
  }

  @Post('scrape-multiple')
  async scrapeMultiple(@Body() body: { urls: Array<{ url: string; platform: string }> }) {
    return this.scrapingService.scrapeMultiple(body.urls);
  }
}