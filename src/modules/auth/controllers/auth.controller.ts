import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { MerchantResponseDto } from '../../merchant/dto/responses/merchant-response.dto';
import { plainToInstance } from 'class-transformer';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { CookieOptions, Request, Response } from 'express';
import { RefreshTokenGuard } from '../guards/refresh-token.guard'; 
import { ServerResponseDto } from '../../../common/app/dto/server-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private isDevelopment = process.env.NODE_ENV === 'development';
  private get cookieOptions(): CookieOptions {
    return {
      sameSite: this.isDevelopment ? 'lax' : 'none',
      secure: !this.isDevelopment,
      httpOnly: true,
    };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterDto): Promise<MerchantResponseDto> {
    const user = await this.authService.register(body);
    const response = plainToInstance(MerchantResponseDto, user, {
      excludeExtraneousValues: true,
    });
    return response;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { accessToken, refreshToken } = await this.authService.login(body);
    if (accessToken && refreshToken) {
      response.cookie('refreshToken', refreshToken, this.cookieOptions);
    }
    return { accessToken, refreshToken };
  }

@Delete('logout')
@HttpCode(HttpStatus.OK)
async logout(@Res({ passthrough: true }) response: Response): Promise<ServerResponseDto> {
  response.clearCookie('refreshToken', this.cookieOptions);
  return { success: true, message: 'Logout successfully' };
}


  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshToken(
    @Req() request: Request,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const merchantId = request.user.id;
    return await this.authService.refreshToken(merchantId);
  }
}
