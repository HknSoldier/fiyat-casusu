import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './database/entities/user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async testDatabaseConnection(email: string) {
    // Simple test to check database connection
    const user = await this.usersRepository.findOne({ where: { email } });
    return { 
      success: true, 
      message: 'Database connection is working',
      userFound: !!user,
    };
  }
}