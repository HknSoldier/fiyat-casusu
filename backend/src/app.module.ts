import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { ProductsModule } from './products/products.module';
import { CompetitorsModule } from './competitors/competitors.module';
import { AlertsModule } from './alerts/alerts.module';
import { ScrapingModule } from './scraping/scraping.module';
import { LegalModule } from './legal/legal.module';
import { DatabaseModule } from './database/database.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        
        // Check for DATABASE_URL from Render/Supabase
        const databaseUrl = process.env.DATABASE_URL;
        
        console.log('[AppModule] DATABASE_URL:', databaseUrl ? 'SET' : 'NOT SET');
        console.log('[AppModule] NODE_ENV:', isProduction ? 'production' : 'other');
        
        // Use DATABASE_URL if available, otherwise use individual DB_* variables
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            ssl: { rejectUnauthorized: false },
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false,
            logging: !isProduction,
          };
        }
        
        // Fallback to individual environment variables (for local development)
        const dbHost = process.env.DB_HOST || 'localhost';
        const dbPort = parseInt(process.env.DB_PORT || '5432');
        const dbUser = process.env.DB_USERNAME || 'postgres';
        const dbPass = process.env.DB_PASSWORD || 'postgres';
        const dbName = process.env.DB_NAME || 'fiyatcasus';
        
        console.log(`[AppModule] Connecting to: ${dbHost}:${dbPort}/${dbName}`);
        
        return {
          type: 'postgres',
          host: dbHost,
          port: dbPort,
          username: dbUser,
          password: dbPass,
          database: dbName,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: !isProduction,
          logging: !isProduction,
        };
      },
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    ProductsModule,
    CompetitorsModule,
    AlertsModule,
    ScrapingModule,
    LegalModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}