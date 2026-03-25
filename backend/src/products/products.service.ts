import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Product } from '../database/entities/product.entity';
import { PriceHistory } from '../database/entities/price-history.entity';
import { StockHistory } from '../database/entities/stock-history.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(PriceHistory)
    private priceHistoryRepository: Repository<PriceHistory>,
    @InjectRepository(StockHistory)
    private stockHistoryRepository: Repository<StockHistory>,
  ) {}

  async create(companyId: string, createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create({
      ...createProductDto,
      companyId,
    });
    return this.productsRepository.save(product);
  }

  async findAll(companyId: string, page = 1, limit = 20): Promise<{ products: Product[], total: number }> {
    const [products, total] = await this.productsRepository.findAndCount({
      where: { companyId },
      relations: ['category'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { products, total };
  }

  async findById(id: string, companyId: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id, companyId },
      relations: ['category', 'priceHistory', 'stockHistory'],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, companyId: string, updateData: Partial<Product>): Promise<Product> {
    const product = await this.findById(id, companyId);
    Object.assign(product, updateData);
    return this.productsRepository.save(product);
  }

  async delete(id: string, companyId: string): Promise<void> {
    const product = await this.findById(id, companyId);
    await this.productsRepository.softDelete(id);
  }

  async getPriceHistory(id: string, companyId: string, startDate?: Date, endDate?: Date): Promise<PriceHistory[]> {
    const product = await this.findById(id, companyId);
    
    const where: any = { productId: id };
    if (startDate && endDate) {
      where.recordedAt = Between(startDate, endDate);
    }
    
    return this.priceHistoryRepository.find({
      where,
      order: { recordedAt: 'ASC' },
    });
  }

  async getCompetitorPrices(id: string, companyId: string): Promise<any[]> {
    const product = await this.findById(id, companyId);
    
    // This would use product matches to get competitor prices
    // For now, return empty array - will be implemented with scraping
    return [];
  }

  async updatePrice(id: string, price: number, stock: number): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Save to price history
    await this.priceHistoryRepository.save({
      productId: id,
      price,
      recordedAt: new Date(),
    });

    // Save to stock history
    await this.stockHistoryRepository.save({
      productId: id,
      stock,
      recordedAt: new Date(),
    });

    // Update current values
    product.currentPrice = price;
    product.currentStock = stock;
    product.lastScraped = new Date();
    
    return this.productsRepository.save(product);
  }

  async search(companyId: string, query: string): Promise<Product[]> {
    return this.productsRepository.find({
      where: {
        companyId,
        name: Like(`%${query}%`),
      },
      take: 20,
    });
  }

  async getStats(companyId: string): Promise<any> {
    const totalProducts = await this.productsRepository.count({ where: { companyId } });
    const productsWithChanges = await this.productsRepository
      .createQueryBuilder('product')
      .where('product.companyId = :companyId', { companyId })
      .andWhere('product.lastScraped >= :since', { since: new Date(Date.now() - 24 * 60 * 60 * 1000) })
      .getCount();
    
    return {
      totalProducts,
      productsWithChanges24h: productsWithChanges,
    };
  }
}