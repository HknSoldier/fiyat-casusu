import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertRuleDto } from './dto/create-alert-rule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('alerts')
@UseGuards(JwtAuthGuard)
export class AlertsController {
  constructor(private alertsService: AlertsService) {}

  @Post('rules')
  async createRule(@Request() req: any, @Body() createDto: CreateAlertRuleDto) {
    return this.alertsService.createRule(req.user.companyId, createDto);
  }

  @Get('rules')
  async findAllRules(@Request() req: any) {
    return this.alertsService.findAllRules(req.user.companyId);
  }

  @Get('rules/stats')
  async getRulesStats(@Request() req: any) {
    const rules = await this.alertsService.findAllRules(req.user.companyId);
    const activeCount = rules.filter(r => r.isActive).length;
    return { total: rules.length, active: activeCount };
  }

  @Put('rules/:id')
  async updateRule(@Request() req: any, @Param('id') id: string, @Body() updateData: any) {
    return this.alertsService.updateRule(id, req.user.companyId, updateData);
  }

  @Delete('rules/:id')
  async deleteRule(@Request() req: any, @Param('id') id: string) {
    return this.alertsService.deleteRule(id, req.user.companyId);
  }

  @Get()
  async findAlerts(
    @Request() req: any,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ) {
    return this.alertsService.findAlerts(req.user.companyId, limit, offset);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req: any) {
    return { count: await this.alertsService.getUnreadCount(req.user.companyId) };
  }

  @Put(':id/read')
  async markAsRead(@Request() req: any, @Param('id') id: string) {
    return this.alertsService.markAsRead(id, req.user.companyId);
  }
}