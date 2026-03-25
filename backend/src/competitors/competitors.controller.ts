import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CompetitorsService } from './competitors.service';
import { CreateCompetitorDto } from './dto/create-competitor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('competitors')
@UseGuards(JwtAuthGuard)
export class CompetitorsController {
  constructor(private competitorsService: CompetitorsService) {}

  @Post()
  async create(@Request() req: any, @Body() createCompetitorDto: CreateCompetitorDto) {
    const platform = createCompetitorDto.platform || 
      this.competitorsService.detectPlatform(createCompetitorDto.url) as any;
    return this.competitorsService.create(req.user.companyId, {
      ...createCompetitorDto,
      platform,
    });
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.competitorsService.findAll(req.user.companyId);
  }

  @Get('stats')
  async getStats(@Request() req: any) {
    return this.competitorsService.getStats(req.user.companyId);
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.competitorsService.findById(id, req.user.companyId);
  }

  @Put(':id')
  async update(@Request() req: any, @Param('id') id: string, @Body() updateData: any) {
    return this.competitorsService.update(id, req.user.companyId, updateData);
  }

  @Delete(':id')
  async delete(@Request() req: any, @Param('id') id: string) {
    return this.competitorsService.delete(id, req.user.companyId);
  }
}