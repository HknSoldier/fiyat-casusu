import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertRule } from '../database/entities/alert-rule.entity';
import { Alert } from '../database/entities/alert.entity';
import { CreateAlertRuleDto } from './dto/create-alert-rule.dto';
import { EmailService } from '../notifications/email.service';
import { Product } from '../database/entities/product.entity';
import { Competitor } from '../database/entities/competitor.entity';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);
  
  constructor(
    @InjectRepository(AlertRule)
    private alertRulesRepository: Repository<AlertRule>,
    @InjectRepository(Alert)
    private alertsRepository: Repository<Alert>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Competitor)
    private competitorsRepository: Repository<Competitor>,
    private emailService: EmailService,
  ) {}

  async createRule(companyId: string, createDto: CreateAlertRuleDto): Promise<AlertRule> {
    const rule = this.alertRulesRepository.create({
      ...createDto,
      companyId,
    });
    return this.alertRulesRepository.save(rule);
  }

  async findAllRules(companyId: string): Promise<AlertRule[]> {
    return this.alertRulesRepository.find({
      where: { companyId },
      order: { createdAt: 'DESC' },
    });
  }

  async findRuleById(id: string, companyId: string): Promise<AlertRule> {
    const rule = await this.alertRulesRepository.findOne({
      where: { id, companyId },
    });
    if (!rule) {
      throw new NotFoundException('Alert rule not found');
    }
    return rule;
  }

  async updateRule(id: string, companyId: string, updateData: Partial<AlertRule>): Promise<AlertRule> {
    const rule = await this.findRuleById(id, companyId);
    Object.assign(rule, updateData);
    return this.alertRulesRepository.save(rule);
  }

  async deleteRule(id: string, companyId: string): Promise<void> {
    const rule = await this.findRuleById(id, companyId);
    await this.alertRulesRepository.softDelete(id);
  }

  async findAlerts(companyId: string, limit = 20, offset = 0): Promise<Alert[]> {
    return this.alertsRepository
      .createQueryBuilder('alert')
      .innerJoin('alert.alertRule', 'rule')
      .where('rule.companyId = :companyId', { companyId })
      .leftJoinAndSelect('alert.product', 'product')
      .leftJoinAndSelect('alert.competitor', 'competitor')
      .orderBy('alert.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();
  }

  async markAsRead(id: string, companyId: string): Promise<Alert> {
    const alert = await this.alertsRepository.findOne({
      where: { id },
      relations: ['alertRule'],
    });
    
    if (!alert || alert.alertRule.companyId !== companyId) {
      throw new NotFoundException('Alert not found');
    }
    
    alert.isRead = true;
    return this.alertsRepository.save(alert);
  }

  async getUnreadCount(companyId: string): Promise<number> {
    return this.alertsRepository
      .createQueryBuilder('alert')
      .innerJoin('alert.alertRule', 'rule')
      .where('rule.companyId = :companyId', { companyId })
      .andWhere('alert.isRead = :isRead', { isRead: false })
      .getCount();
  }

  async createAlert(alertRuleId: string, productId: string, competitorId: string, oldValue: number, newValue: number): Promise<Alert> {
    const alert = this.alertsRepository.create({
      alertRuleId,
      productId,
      competitorId,
      oldValue,
      newValue,
      isRead: false,
    });
    
    const savedAlert = await this.alertsRepository.save(alert);
    
    // Send email notification
    await this.sendAlertNotification(savedAlert, productId, competitorId, oldValue, newValue);
    
    return savedAlert;
  }
  
  /**
   * Send email notification for price/stock changes
   */
  private async sendAlertNotification(alert: Alert, productId: string, competitorId: string, oldValue: number, newValue: number): Promise<void> {
    try {
      // Get product and competitor details
      const product = await this.productsRepository.findOne({ where: { id: productId } });
      const competitor = await this.competitorsRepository.findOne({ where: { id: competitorId } });
      const alertRule = await this.alertRulesRepository.findOne({ 
        where: { id: alert.alertRuleId },
        relations: ['company', 'company.users']
      });
      
      if (!product || !competitor || !alertRule?.company?.users) {
        this.logger.warn('Missing data for email notification');
        return;
      }
      
      const user = alertRule.company.users[0];
      const changePercent = oldValue > 0 ? ((newValue - oldValue) / oldValue) * 100 : 100;
      
      await this.emailService.sendPriceAlert({
        to: user.email,
        subject: `💰 ${product.name} - Fiyat Değişimi Alertı`,
        productName: product.name,
        oldPrice: oldValue,
        newPrice: newValue,
        changePercent,
        platform: competitor.platform,
        productUrl: product.url || `http://localhost:3000/dashboard/products/${productId}`,
      });
      
      this.logger.log(`Price alert email queued for ${user.email}`);
    } catch (error) {
      this.logger.error(`Failed to send alert notification: ${error}`);
    }
  }
}