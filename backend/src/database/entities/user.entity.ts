import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from './company.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255 })
  passwordHash: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'uuid', nullable: true })
  companyId: string;

  @ManyToOne(() => Company, (company) => company.users, { nullable: true })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ default: 'user', length: 20 })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  emailVerificationToken: string;

  @Column({ default: 'pending', length: 20 })
  status: string;

  @DeleteDateColumn()
  deletedAt: Date;
}