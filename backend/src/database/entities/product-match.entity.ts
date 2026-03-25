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
import { Company } from './company.entity';

@Entity('product_matches')
export class ProductMatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'uuid' })
  competitorId: string;

  @ManyToOne(() => Competitor)
  @JoinColumn({ name: 'competitorId' })
  competitor: Competitor;

  @Column({ length: 255 })
  competitorProductId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  confidence: number;

  @Column({ default: false })
  isConfirmed: boolean;

  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @CreateDateColumn()
  createdAt: Date;
}