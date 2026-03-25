import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Competitor } from './competitor.entity';

@Entity('stock_history')
export class StockHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, (product) => product.stockHistory)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'uuid', nullable: true })
  competitorId: string;

  @ManyToOne(() => Competitor, { nullable: true })
  @JoinColumn({ name: 'competitorId' })
  competitor: Competitor;

  @Column({ type: 'int' })
  stock: number;

  @CreateDateColumn()
  recordedAt: Date;
}