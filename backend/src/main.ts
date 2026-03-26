import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
    });
  
    app.setGlobalPrefix('api');
    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    app.enableCors({
      origin: '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Global exception filter for better error logging
    app.use((err: any, req: any, res: any, next: any) => {
      console.error('[Global Error]', err.stack || err.message || err);
      next(err);
    });

    const port = process.env.PORT || 4000;
    await app.listen(port);
    logger.log(`🚀 Fiyat Casusu API running on port ${port}`);
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();