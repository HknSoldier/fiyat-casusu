import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
  
  @Get()
  getRoot() {
    return { message: 'Fiyat Casusu API', version: '1.0.0' };
  }

  @Post('test-db')
  async testDb(@Body('email') email: string) {
    try {
      return await this.appService.testDatabaseConnection(email);
    } catch (error) {
      return { error: error.message, stack: error.stack };
    }
  }
}