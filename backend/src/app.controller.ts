import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
  
  @Get()
  getRoot() {
    return { message: 'Fiyat Casusu API', version: '1.0.0' };
  }
}