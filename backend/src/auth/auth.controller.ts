import {
  Body,
  Controller,
  Get,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';

import { AuthService } from './auth.service.js';
import { Auth } from './decorators/auth/auth.decorator.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { User } from './entities/user.entity.js';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('check-status')
  @Auth()
  checkStatus(@Req() request: RequestWithUser) {
    const user = request.user;

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isActive: user.isActive,
      roles: user.roles,
      empleado_id: user.empleado_id,
    };
  }

  @Get('admin-check')
  @Auth('admin')
  adminCheck(@Req() request: RequestWithUser) {
    return {
      message: 'Acceso de administrador autorizado',
      user: {
        id: request.user.id,
        email: request.user.email,
        roles: request.user.roles,
      },
    };
  }
}