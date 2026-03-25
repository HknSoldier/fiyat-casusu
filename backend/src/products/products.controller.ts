import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  async create(@Request() req: any, @Body() createProductDto: CreateProductDto) {
    return this.productsService.create(req.user.companyId, createProductDto);
  }

  @Get()
  async findAll(
    @Request() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.productsService.findAll(req.user.companyId, page, limit);
  }

  @Get('stats')
  async getStats(@Request() req: any) {
    return this.productsService.getStats(req.user.companyId);
  }

  @Get('search')
  async search(@Request() req: any, @Query('q') query: string) {
    return this.productsService.search(req.user.companyId, query);
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.productsService.findById(id, req.user.companyId);
  }

  @Put(':id')
  async update(@Request() req: any, @Param('id') id: string, @Body() updateData: UpdateProductDto) {
    return this.productsService.update(id, req.user.companyId, updateData);
  }

  @Delete(':id')
  async delete(@Request() req: any, @Param('id') id: string) {
    return this.productsService.delete(id, req.user.companyId);
  }

  @Get(':id/history')
  async getHistory(
    @Request() req: any,
    @Param('id') id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.productsService.getPriceHistory(
      id,
      req.user.companyId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get(':id/competitors')
  async getCompetitorPrices(@Request() req: any, @Param('id') id: string) {
    return this.productsService.getCompetitorPrices(id, req.user.companyId);
  }
}