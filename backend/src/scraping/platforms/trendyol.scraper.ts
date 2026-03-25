import { Injectable, Logger } from '@nestjs/common';
import { ScrapedProduct } from '../scraping.service';

@Injectable()
export class TrendyolScraper {
  private readonly logger = new Logger(TrendyolScraper.name);

  async scrape(url: string): Promise<ScrapedProduct | null> {
    this.logger.log(`Scraping Trendyol: ${url}`);
    
    try {
      const productId = this.extractProductId(url);
      
      if (!productId) {
        this.logger.warn('Could not extract product ID from URL');
        return null;
      }

      // Use API-based approach for reliable data extraction
      const productData = await this.scrapeViaAPI(productId);
      
      if (productData) {
        return {
          name: productData.name,
          price: productData.price,
          stock: productData.stock,
          imageUrl: productData.imageUrl || '',
          sku: productId,
        };
      }

      // Fallback to basic scrape
      return await this.scrapeBasic(url, productId);
    } catch (error) {
      this.logger.error(`Error scraping Trendyol: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }

  /**
   * Try Trendyol's product API endpoint
   */
  private async scrapeViaAPI(productId: string): Promise<{ name: string; price: number; stock: number; imageUrl: string } | null> {
    try {
      // Trendyol has a product API we can try
      const apiUrl = `https://www.trendyol.com/pdp/getProductDetails?productId=${productId}`;
      
      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'tr-TR,tr;q=0.9',
        },
      });

      if (!response.ok) {
        this.logger.warn(`API call failed: ${response.status}`);
        return null;
      }

      const data = await response.json() as any;
      
      if (data && data.product) {
        return {
          name: data.product.name || data.product.title || 'Unknown Product',
          price: this.parsePrice(data.product.price || data.product.sellingPrice),
          stock: this.parseStock(data.product.stock || data.product.inventory),
          imageUrl: data.product.imageUrl || data.product.image || '',
        };
      }

      return null;
    } catch (error) {
      this.logger.warn(`API approach failed: ${error instanceof Error ? error.message : 'Unknown'}`);
      return null;
    }
  }

  /**
   * Basic HTML scraping using fetch
   */
  private async scrapeBasic(url: string, productId: string): Promise<ScrapedProduct | null> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        },
      });

      if (!response.ok) {
        this.logger.warn(`HTTP error: ${response.status}`);
        return null;
      }

      const html = await response.text();

      // Extract product name
      const nameMatch = html.match(/<h1[^>]*class="[^"]*pr-new-br[^"]*"[^>]*>([^<]+)<\/h1>/i) 
        || html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
      const name = nameMatch ? nameMatch[1].trim() : 'Unknown Product';

      // Extract price - look for price elements
      const priceMatch = html.match(/"price":\s*(\d+(?:\.\d+)?)/) 
        || html.match(/(\d+[\d.,]*)\s*TL/i)
        || html.match(/(\d+[\d.,]*)\s*₺/);
      const price = priceMatch ? this.parsePrice(priceMatch[1]) : 0;

      // Extract stock info
      const stockMatch = html.match(/stok[^>]*>(\d+)/i)
        || html.match(/(\d+)\s*adet\s*(?:stok|var)/i);
      const stock = stockMatch ? parseInt(stockMatch[1], 10) : 1;

      // Extract image
      const imgMatch = html.match(/"image":\s*"([^"]+)"/) 
        || html.match(/<img[^>]*data-src="([^"]+)"/i);
      const imageUrl = imgMatch ? imgMatch[1] : '';

      this.logger.log(`Successfully scraped: ${name}, price: ${price}, stock: ${stock}`);
      
      return {
        name,
        price,
        stock,
        imageUrl,
        sku: productId,
      };
    } catch (error) {
      this.logger.error(`Basic scrape error: ${error instanceof Error ? error.message : 'Unknown'}`);
      return null;
    }
  }

  private parsePrice(price: string | number | undefined): number {
    if (!price) return 0;
    if (typeof price === 'number') return price;
    
    // Turkish number format: 1.234,56 -> 1234.56
    const cleaned = String(price)
      .replace(/[^\d,.]/g, '')
      .replace(/\./g, '')
      .replace(',', '.');
    return parseFloat(cleaned) || 0;
  }

  private parseStock(stock: any): number {
    if (typeof stock === 'number') return stock;
    if (typeof stock === 'string') {
      const match = stock.match(/\d+/);
      return match ? parseInt(match[0], 10) : 1;
    }
    return 1;
  }

  private extractProductId(url: string): string | null {
    // e.g., https://www.trendyol.com/brand/product-p-12345678
    const match = url.match(/p-(\d+)/);
    return match ? match[1] : null;
  }
}