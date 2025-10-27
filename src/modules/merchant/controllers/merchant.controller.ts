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
import { MerchantService } from '../services/merchant.service';
import { QueryMerchantDto } from '../dto/requests/query-merchant.dto';
import { plainToInstance } from 'class-transformer';
import { MerchantResponseDto } from '../dto/responses/merchant-response.dto';
import { Request } from 'express';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { UpdateMerchantDto } from '../dto/requests/update-merchant.dto';
import { ServerPaginatedResponseDto } from '../../../common/app/dto/server-response.dto';

@UseGuards(AccessTokenGuard)
@Controller('merchants')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  async getMerchants(
    @Query() query: QueryMerchantDto,
  ): Promise<ServerPaginatedResponseDto<MerchantResponseDto>> {
    const { meta, data } = await this.merchantService.findMerchants(query);
    const transformedData = plainToInstance(MerchantResponseDto, data, {
      excludeExtraneousValues: true,
    });
    return {
      message: 'Merchants retrieved successfully',
      data: transformedData,
      meta,
    };
  }
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() request: Request): Promise<MerchantResponseDto> {
    const merchantId = request.user.id;
    const merchant = await this.merchantService.findMerchantById(merchantId);
    return plainToInstance(MerchantResponseDto, merchant, {
      excludeExtraneousValues: true,
    });
  }
  @Patch('me')
  @HttpCode(HttpStatus.OK)
  async updateMerchantById(
    @Req() request: Request,
    @Body() body: UpdateMerchantDto,
  ): Promise<MerchantResponseDto> {
    const merchantId = request.user.id;
    const user = await this.merchantService.updateMerchantById(
      merchantId,
      body,
    );
    return plainToInstance(MerchantResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
