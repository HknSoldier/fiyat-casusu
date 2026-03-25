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

export type Platform = 'trendyol' | 'hepsiburada' | 'n11' | 'amazon';

@Entity('competitors')
export class Competitor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, (company) => company.competitors)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: ['trendyol', 'hepsiburada', 'n11', 'amazon'],
  })
  platform: Platform;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'text', nullable: true })
  logoUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}