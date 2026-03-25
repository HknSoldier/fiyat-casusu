import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';
import { AlertRule } from './alert-rule.entity';
import { ProductMatch } from './product-match.entity';
import { Competitor } from './competitor.entity';

export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: ['free', 'pro', 'enterprise'],
    default: 'free',
  })
  subscriptionPlan: SubscriptionPlan;

  @Column({ type: 'timestamp', nullable: true })
  subscriptionExpires: Date;

  @Column({ default: 10 })
  apiLimit: number;

  @Column({ default: 1440 })
  scrapingInterval: number; // in minutes

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  kvkkConsent: boolean;

  @Column({ type: 'timestamp', nullable: true })
  kvkkConsentDate: Date | null;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Product, (product) => product.company)
  products: Product[];

  @OneToMany(() => AlertRule, (alertRule) => alertRule.company)
  alertRules: AlertRule[];

  @OneToMany(() => ProductMatch, (match) => match.company)
  productMatches: ProductMatch[];

  @OneToMany(() => Competitor, (competitor) => competitor.company)
  competitors: Competitor[];
}