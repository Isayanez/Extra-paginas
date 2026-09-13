import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { User } from './entities/user.entity.js';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { password, ...userData } = registerDto;

    try {
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
        roles: ['user'],
        isActive: true,
      });

      await this.userRepository.save(user);

      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        isActive: user.isActive,
        roles: user.roles,
        empleado_id: user.empleado_id,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const passwordValid = bcrypt.compareSync(password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isActive: user.isActive,
      roles: user.roles,
      empleado_id: user.empleado_id,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: { id: number }): string {
    return this.jwtService.sign(payload);
  }

  private handleDBExceptions(error: any): never {
    this.logger.error(error);

    if (error.code === 'ER_DUP_ENTRY') {
      throw new BadRequestException(
        'El correo o empleado ya se encuentra registrado',
      );
    }

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw new BadRequestException(
        'El empleado indicado no existe',
      );
    }

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}