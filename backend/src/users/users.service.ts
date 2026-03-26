import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../database/entities/user.entity';
import { Company } from '../database/entities/company.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async create(createUserDto: Partial<CreateUserDto> & { passwordHash?: string }): Promise<User> {
    console.log('[UsersService] create called');
    console.log('[UsersService] companyName:', createUserDto.companyName);
    
    let company: Company | null = null;
    
    if (createUserDto.companyName) {
      console.log('[UsersService] Creating company...');
      try {
        company = this.companiesRepository.create({
          name: createUserDto.companyName,
          subscriptionPlan: 'free',
          apiLimit: 10,
          scrapingInterval: 1440,
        });
        company = await this.companiesRepository.save(company);
        console.log('[UsersService] Company created:', company.id);
      } catch (companyError) {
        console.log('[UsersService] Company creation failed:', companyError.message);
        // Continue without company
      }
    }

    console.log('[UsersService] Creating user...');
    const user = this.usersRepository.create({
      email: createUserDto.email,
      passwordHash: createUserDto.passwordHash,
      name: createUserDto.name,
      companyId: company?.id,
      role: 'user',
      emailVerified: false,
      status: createUserDto.status || 'pending',
      emailVerificationToken: createUserDto.emailVerificationToken,
    });
    console.log('[UsersService] User entity created');

    const savedUser = await this.usersRepository.save(user);
    console.log('[UsersService] User saved:', savedUser.id);
    
    return savedUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { id },
      relations: ['company'],
    });
  }

  async findAll(companyId: string): Promise<User[]> {
    return this.usersRepository.find({ where: { companyId } });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }
    
    return user;
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    Object.assign(user, updateData);
    return this.usersRepository.save(user);
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { emailVerificationToken: token } });
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    await this.usersRepository.softDelete(id);
  }
}