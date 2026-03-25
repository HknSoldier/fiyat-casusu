import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from './company.entity';

export type AlertType = 'price_drop' | 'price_increase' | 'stock_out' | 'stock_low' | 'competitor_add' | 'competitor_remove';

@Entity('alert_rules')
export class AlertRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, (company) => company.alertRules)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: ['price_drop', 'price_increase', 'stock_out', 'stock_low', 'competitor_add', 'competitor_remove'],
  })
  type: AlertType;

  @Column({ type: 'jsonb' })
  condition: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', default: [] })
  notificationChannels: { type: string; config?: Record<string, any> }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}