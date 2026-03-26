import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  console.log('[Bootstrap] Starting application...');
  
  try {
    console.log('[Bootstrap] Creating NestFactory...');
    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
    });
    console.log('[Bootstrap] App created successfully');
  
    app.setGlobalPrefix('api');
    console.log('[Bootstrap] Global prefix set');
    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    console.log('[Bootstrap] ValidationPipe set');

    app.enableCors({
      origin: '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
    console.log('[Bootstrap] CORS enabled');

    // Apply global exception filter
    app.useGlobalFilters(new AllExceptionsFilter());
    console.log('[Bootstrap] Exception filter set');

    const port = process.env.PORT || 4000;
    console.log(`[Bootstrap] About to listen on port ${port}...`);
    await app.listen(port);
    logger.log(`🚀 Fiyat Casusu API running on port ${port}`);
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();