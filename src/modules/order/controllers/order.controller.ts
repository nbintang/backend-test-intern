import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dto/requests/create-order.dto';
import { UpdateOrderDto } from '../dto/requests/update-order.dto';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { OrderResponseDto } from '../dto/responses/order-response.dto';
import { QueryOrderDto } from '../dto/requests/query-order.dto';
import { ServerPaginatedResponseDto } from '../../../common/app/dto/server-response.dto';
import { ServerResponseDto } from '../../../common/app/dto/server-response.dto';

@UseGuards(AccessTokenGuard)
@Controller('protected/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() request: Request,
  ): Promise<OrderResponseDto> {
    const mechantId = request.user.id;
    const order = await this.orderService.createOrder(
      mechantId,
      createOrderDto,
    );
    return plainToInstance(OrderResponseDto, order, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getOrders(
    @Query() query: QueryOrderDto,
  ): Promise<ServerPaginatedResponseDto<OrderResponseDto>> {
    const { data: orders, meta } = await this.orderService.findOrders(query);
    const transformedData = plainToInstance(OrderResponseDto, orders, {
      excludeExtraneousValues: true,
    });
    return {
      message: 'Orders retrieved successfully',
      data: transformedData,
      meta,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOrderById(@Param('id') id: string): Promise<OrderResponseDto> {
    const order = await this.orderService.findOrderById(+id);
    return plainToInstance(OrderResponseDto, order, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateOrderById(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    const updatedOrder = await this.orderService.updateOrderById(
      +id,
      updateOrderDto,
    );
    return plainToInstance(OrderResponseDto, updatedOrder, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteOrderById(@Param('id') id: string): Promise<ServerResponseDto> {
    return await this.orderService.deleteOrderById(+id);
  }
}
