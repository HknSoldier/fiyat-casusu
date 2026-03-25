import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Company } from './company.entity';
import { Category } from './category.entity';
import { PriceHistory } from './price-history.entity';
import { StockHistory } from './stock-history.entity';
import { ProductMatch } from './product-match.entity';

export type Platform = 'trendyol' | 'hepsiburada' | 'n11' | 'amazon';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, (company) => company.products)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ length: 500 })
  name: string;

  @Column({ length: 100, nullable: true })
  sku: string;

  @Column({ length: 100, nullable: true })
  barcode: string;

  @Column({ type: 'text', nullable: true })
  imageUrl: string;

  @Column({ type: 'uuid', nullable: true })
  categoryId: string;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ type: 'text' })
  url: string;

  @Column({
    type: 'enum',
    enum: ['trendyol', 'hepsiburada', 'n11', 'amazon'],
  })
  platform: Platform;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  currentPrice: number;

  @Column({ type: 'int', nullable: true })
  currentStock: number;

  @Column({ type: 'timestamp', nullable: true })
  lastScraped: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PriceHistory, (priceHistory) => priceHistory.product)
  priceHistory: PriceHistory[];

  @OneToMany(() => StockHistory, (stockHistory) => stockHistory.product)
  stockHistory: StockHistory[];

  @OneToMany(() => ProductMatch, (match) => match.product)
  matches: ProductMatch[];
}