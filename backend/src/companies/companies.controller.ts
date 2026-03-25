import { Controller, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Get('me')
  async getCompany(@Request() req: any) {
    return this.companiesService.findById(req.user.companyId);
  }

  @Put('me')
  async updateCompany(@Request() req: any, @Body() updateData: any) {
    return this.companiesService.update(req.user.companyId, updateData);
  }

  @Get('me/subscription')
  async getSubscription(@Request() req: any) {
    const company = await this.companiesService.findById(req.user.companyId);
    return {
      plan: company?.subscriptionPlan,
      expires: company?.subscriptionExpires,
      apiLimit: company?.apiLimit,
      scrapingInterval: company?.scrapingInterval,
    };
  }
}