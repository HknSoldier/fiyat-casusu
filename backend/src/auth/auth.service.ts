import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from '../notifications/email.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    console.log('[AuthService] register called with:', createUserDto.email);
    
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    console.log('[AuthService] existingUser:', existingUser ? 'found' : 'not found');
    
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    console.log('[AuthService] password hashed');
    
    const emailVerificationToken = randomBytes(32).toString('hex');
    
    console.log('[AuthService] creating user...');
    const user = await this.usersService.create({
      ...createUserDto,
      passwordHash,
      emailVerificationToken,
      status: 'pending',
    });
    console.log('[AuthService] user created, id:', user.id);

    // Send verification email (non-blocking)
    try {
      await this.emailService.sendVerificationEmail(user.email, emailVerificationToken);
    } catch (emailError) {
      // Log but don't fail registration
      console.log('Verification email could not be sent:', emailError);
    }

    return {
      message: 'Registration successful. Please check your email to verify your account.',
      token: this.generateToken(user),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status as string,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (user.status !== 'active') {
      throw new UnauthorizedException('Please verify your email to activate your account');
    }

    const token = this.generateToken(user);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status as string,
      },
      token,
    };
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findByVerificationToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid verification token');
    }

    await this.usersService.update(user.id, {
      emailVerified: true,
      status: 'active',
    });

    return { message: 'Email verified successfully. Your account is now active.' };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return { message: 'If this email exists, a verification link has been sent' };
    }

    if (user.emailVerified) {
      return { message: 'Email is already verified' };
    }

    const newToken = randomBytes(32).toString('hex');
    await this.usersService.update(user.id, { emailVerificationToken: newToken });
    await this.emailService.sendVerificationEmail(user.email, newToken);

    return { message: 'Verification email sent' };
  }

  async validateUser(userId: string) {
    return this.usersService.findById(userId);
  }

  private generateToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }
}