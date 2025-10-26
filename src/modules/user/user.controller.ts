import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { QueryUserDto } from './dto/query-user.dto';
import { plainToInstance } from 'class-transformer'; 
import { ResponseUserDto } from './dto/response-user.dto';
import { Request } from 'express';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { ServerPaginatedResponseDto } from '../../common/app/dto/server-response.dto';

@UseGuards(AccessTokenGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(
    @Query() query: QueryUserDto,
  ): Promise<ServerPaginatedResponseDto<ResponseUserDto>> {
    const { meta, data } = await this.userService.findUsers(query);
    const transformedData = plainToInstance(ResponseUserDto, data, {
      excludeExtraneousValues: true,
    });
    return {
      message: 'Users retrieved successfully',
      data: transformedData,
      meta,
    };
  }
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() request: Request): Promise<ResponseUserDto> {
    const user = await this.userService.findUserById(request.user.id);
    const response = plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
    return response;
  }
  @Patch('me')
  @HttpCode(HttpStatus.CREATED)
  async updateUserById(
    @Req() request: Request,
    @Body() body: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    const id = request.user.id;
    const user = await this.userService.updateUserById(id, body);
    const response = plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
    return response;
  }
}
