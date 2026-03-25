import { Injectable, Logger } from '@nestjs/common';
import { TrendyolScraper } from './platforms/trendyol.scraper';
import { HepsiburadaScraper } from './platforms/hepsiburada.scraper';
import { N11Scraper } from './platforms/n11.scraper';
import { AmazonScraper } from './platforms/amazon.scraper';

export interface ScrapedProduct {
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
  sku?: string;
  barcode?: string;
}

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name);

  constructor(
    private trendyolScraper: TrendyolScraper,
    private hepsiburadaScraper: HepsiburadaScraper,
    private n11Scraper: N11Scraper,
    private amazonScraper: AmazonScraper,
  ) {}

  async scrapeProduct(url: string, platform: string): Promise<ScrapedProduct | null> {
    this.logger.log(`Scraping product from ${platform}: ${url}`);
    
    try {
      switch (platform) {
        case 'trendyol':
          return await this.trendyolScraper.scrape(url);
        case 'hepsiburada':
          return await this.hepsiburadaScraper.scrape(url);
        case 'n11':
          return await this.n11Scraper.scrape(url);
        case 'amazon':
          return await this.amazonScraper.scrape(url);
        default:
          this.logger.warn(`Unknown platform: ${platform}`);
          return null;
      }
    } catch (error) {
      this.logger.error(`Error scraping ${platform}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }

  async scrapeMultiple(urls: Array<{ url: string; platform: string }>): Promise<ScrapedProduct[]> {
    const results: ScrapedProduct[] = [];
    
    for (const { url, platform } of urls) {
      const result = await this.scrapeProduct(url, platform);
      if (result) {
        results.push(result);
      }
    }
    
    return results;
  }

  getScraper(platform: string): any {
    switch (platform) {
      case 'trendyol':
        return this.trendyolScraper;
      case 'hepsiburada':
        return this.hepsiburadaScraper;
      case 'n11':
        return this.n11Scraper;
      case 'amazon':
        return this.amazonScraper;
      default:
        return null;
    }
  }
}