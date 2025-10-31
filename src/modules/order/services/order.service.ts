import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from '../dto/requests/create-order.dto';
import { UpdateOrderDto } from '../dto/requests/update-order.dto';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { ProductService } from '../../product/services/product.service';
import { OrderStatus } from '../enums/order-status.enum';
import { Prisma } from '@prisma/client';
import { QueryOrderDto } from '../dto/requests/query-order.dto';
import { ServerPaginatedResponseDto } from '../../../common/app/dto/server-response.dto';
import { OrderResponse } from '../interfaces/order-response.interface';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
  ) {}
  async createOrder(
    merchantId: number,
    dto: CreateOrderDto,
  ): Promise<OrderResponse> {
    const { status, ...rest } = dto;
    const product = await this.productService.findProductById(rest.productId);
    if (product.stock < rest.quantity) {
      throw new BadRequestException('Insufficient product stock');
    }
    const totalAmount = product.price * rest.quantity;
    await this.productService.updateProductById(rest.productId, {
      stock: product.stock - rest.quantity,
    });
    return await this.prisma.order.create({
      data: {
        merchantId,
        totalAmount,
        status: status ?? OrderStatus.PENDING,
        ...dto,
      },
      include: { product: { include: { category: true } }, merchant: true },
    });
  }
  async findOrders(
    query: QueryOrderDto,
  ): Promise<ServerPaginatedResponseDto<OrderResponse>> {
    const { page = 1, limit = 10, search, status, category } = query;
    const skip = (page - 1) * limit;
    const where: Prisma.OrderWhereInput = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { customerName: { contains: search, mode: 'insensitive' } },
          { product: { name: { contains: search, mode: 'insensitive' } } },
        ],
      }),
      ...(category && {
        product: {
          category: { name: { equals: category, mode: 'insensitive' } },
        },
      }),
    };
    const orders = await this.prisma.order.findMany({
      where,
      include: { product: { include: { category: true } }, merchant: true },
      skip,
      take: limit,
    });
    const total = await this.prisma.order.count({ where });
    return {
      data: orders,
      meta: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }

  async findOrderById(id: number): Promise<OrderResponse> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { product: { include: { category: true } }, merchant: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateOrderById(id: number, dto: UpdateOrderDto): Promise<OrderResponse> {
    const { status, ...rest } = dto;
    const order = await this.findOrderById(id);
    if (!order) throw new NotFoundException('Order not found');
    const quantity = rest.quantity ?? order.quantity;
    const product = await this.productService.findProductById(
      rest.productId ?? order.productId,
    );

    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient product stock');
    }

    const totalAmount = product.price * quantity;

    await this.productService.updateProductById(product.id, {
      stock: product.stock - quantity,
    });

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        totalAmount,
        status: status ?? order.status,
        quantity,
        productId: product.id,
        customerName: rest.customerName ?? order.customerName,
      },
      include: { product: { include: { category: true } }, merchant: true },
    });

    return updatedOrder;
  }

  async deleteOrderById(id: number): Promise<{ message: string }> {
    const order = await this.findOrderById(id);
    await this.prisma.order.delete({
      where: { id: order.id },
    });
    return {
      message: 'Order deleted successfully',
    };
  }
}
