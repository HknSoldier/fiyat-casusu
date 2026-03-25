import { Controller, Get, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findById(req.user.id);
    return {
      id: user?.id,
      email: user?.email,
      name: user?.name,
      role: user?.role,
      company: user?.company,
    };
  }

  @Put('me')
  async updateProfile(@Request() req: any, @Body() updateData: any) {
    return this.usersService.update(req.user.id, updateData);
  }
}