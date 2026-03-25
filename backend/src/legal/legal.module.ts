import { Module } from '@nestjs/common';
import { LegalController } from './legal.controller';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [CompaniesModule],
  controllers: [LegalController],
})
export class LegalModule {}