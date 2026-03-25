import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AlertRule } from './alert-rule.entity';
import { Product } from './product.entity';
import { Competitor } from './competitor.entity';

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  alertRuleId: string;

  @ManyToOne(() => AlertRule)
  @JoinColumn({ name: 'alertRuleId' })
  alertRule: AlertRule;

  @Column({ type: 'uuid', nullable: true })
  productId: string;

  @ManyToOne(() => Product, { nullable: true })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'uuid', nullable: true })
  competitorId: string;

  @ManyToOne(() => Competitor, { nullable: true })
  @JoinColumn({ name: 'competitorId' })
  competitor: Competitor;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  oldValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  newValue: number;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}