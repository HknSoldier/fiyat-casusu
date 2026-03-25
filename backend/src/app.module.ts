import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
        const databaseUrl = configService.get('DATABASE_URL');
        
        console.log('[AppModule] DATABASE_URL:', databaseUrl ? 'SET' : 'NOT SET');
        console.log('[AppModule] NODE_ENV:', isProduction ? 'production' : 'other');
        
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            ssl: { rejectUnauthorized: false },
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false, // Always false in production
            logging: !isProduction,
          };
        }
        
        return {
          type: 'postgres',
          host: configService.get('DB_HOST') || 'localhost',
          port: parseInt(configService.get('DB_PORT') || '5432'),
          username: configService.get('DB_USERNAME') || 'postgres',
          password: configService.get('DB_PASSWORD') || 'postgres',
          database: configService.get('DB_NAME') || 'fiyatcasus',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get('NODE_ENV') !== 'production',
          logging: configService.get('NODE_ENV') === 'development',
        };
      },
      inject: [ConfigService],
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
})
export class AppModule {}