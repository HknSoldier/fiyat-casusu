import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Competitor } from '../database/entities/competitor.entity';
import { CreateCompetitorDto } from './dto/create-competitor.dto';

@Injectable()
export class CompetitorsService {
  constructor(
    @InjectRepository(Competitor)
    private competitorsRepository: Repository<Competitor>,
  ) {}

  async create(companyId: string, createCompetitorDto: CreateCompetitorDto): Promise<Competitor> {
    const competitor = this.competitorsRepository.create({
      ...createCompetitorDto,
      companyId,
    });
    return this.competitorsRepository.save(competitor);
  }

  async findAll(companyId: string): Promise<Competitor[]> {
    return this.competitorsRepository.find({
      where: { companyId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string, companyId: string): Promise<Competitor> {
    const competitor = await this.competitorsRepository.findOne({
      where: { id, companyId },
    });
    if (!competitor) {
      throw new NotFoundException('Competitor not found');
    }
    return competitor;
  }

  async update(id: string, companyId: string, updateData: Partial<Competitor>): Promise<Competitor> {
    const competitor = await this.findById(id, companyId);
    Object.assign(competitor, updateData);
    return this.competitorsRepository.save(competitor);
  }

  async delete(id: string, companyId: string): Promise<void> {
    const competitor = await this.findById(id, companyId);
    await this.competitorsRepository.softDelete(id);
  }

  async getStats(companyId: string): Promise<any> {
    const total = await this.competitorsRepository.count({ where: { companyId, isActive: true } });
    return { activeCompetitors: total };
  }

  detectPlatform(url: string): string {
    const urlLower = url.toLowerCase();
    if (urlLower.includes('trendyol.com')) return 'trendyol';
    if (urlLower.includes('hepsiburada.com')) return 'hepsiburada';
    if (urlLower.includes('n11.com')) return 'n11';
    if (urlLower.includes('amazon.com.tr')) return 'amazon';
    return 'unknown';
  }
}