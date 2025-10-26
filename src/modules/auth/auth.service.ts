import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import * as argon from 'argon2';
import { UserPayload } from './interfaces/user-jwt-payload.interface';
import { JwtService } from '@nestjs/jwt'; 
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';
import { AuthConfigService } from '../../config/auth/auth.config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly authConfigService: AuthConfigService,
  ) {}
  private async generateJwtTokens(payload: UserPayload): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        payload,
        {
          secret: this.authConfigService.accessSecret,
          expiresIn: '30s',
        },
      ),
      this.jwtService.signAsync(
        payload,
        {
          secret: this.authConfigService.refreshSecret,
          expiresIn: '1d',
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
  async register(dto: RegisterDto): Promise<User> {
    const existedUser = await this.userService.findExistingUserByEmail(
      dto.email,
    );
    if (existedUser) throw new ConflictException('User already exists');
    const { password, confirmationPassword, ...rest } = dto;
    const user = await this.userService.createUser({
      ...rest,
      password: await argon.hash(password),
    });
    return user;
  }

  async login(
    dto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userService.findExistingUserByEmail(dto.email);
    if (!user) throw new UnauthorizedException('User not registered');
    const isValidPassword = await argon.verify(user.password, dto.password);
    if (!isValidPassword) throw new UnauthorizedException('Invalid password');
    const { accessToken, refreshToken } = await this.generateJwtTokens({
      id: user.id,
      email: user.email,
    });
    return { accessToken, refreshToken };
  }

  async refreshToken(
    userId: number,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userService.findUserById(userId);
    if (!user) throw new ForbiddenException('Access Denied');
    return await this.generateJwtTokens({ id: user.id, email: user.email });
  }
}
