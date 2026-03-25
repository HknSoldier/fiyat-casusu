import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../database/entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async findById(id: string): Promise<Company | null> {
    return this.companiesRepository.findOne({ where: { id } });
  }

  async update(id: string, updateData: Partial<Company>): Promise<Company> {
    const company = await this.findById(id);
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    
    Object.assign(company, updateData);
    return this.companiesRepository.save(company);
  }

  async updateSubscription(id: string, plan: string, expires: Date): Promise<Company> {
    const company = await this.findById(id);
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    
    company.subscriptionPlan = plan as any;
    company.subscriptionExpires = expires;
    return this.companiesRepository.save(company);
  }

  async updateKvkkConsent(id: string, consent: boolean): Promise<Company> {
    const company = await this.findById(id);
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    
    company.kvkkConsent = consent;
    company.kvkkConsentDate = consent ? new Date() : null;
    return this.companiesRepository.save(company);
  }
}