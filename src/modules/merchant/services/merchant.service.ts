import { Injectable, NotFoundException } from '@nestjs/common';
import { Merchant, Prisma } from '@prisma/client';
import { QueryMerchantDto } from '../dto/requests/query-merchant.dto';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { ServerPaginatedResponseDto } from '../../../common/app/dto/server-response.dto';
import { RedisService } from '../../../common/redis/redis.service';

@Injectable()
export class MerchantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}
  private merchantKey(id: number) {
    return this.redisService.useKey('merchant').add(id);
  }
  async createMerchant(data: Prisma.MerchantCreateInput): Promise<Merchant> {
    const merchant = await this.prisma.merchant.create({
      data,
    });
    return merchant;
  }

  async findMerchants(
    query: QueryMerchantDto,
  ): Promise<ServerPaginatedResponseDto<Merchant>> {
    const key = this.redisService
      .useKey('merchant:list')
      .add(query.page ?? 1)
      .add(query.limit ?? 10)
      .add(query.search ?? 'all');

    const cached =
      await this.redisService.get<ServerPaginatedResponseDto<Merchant>>(key);

    if (cached) return cached;

    const { limit = 10, page = 1, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.MerchantWhereInput = {
      ...(search && {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { fullName: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const merchants = await this.prisma.merchant.findMany({
      where,
      skip,
      take: limit,
    });

    const total = await this.prisma.merchant.count({ where });

    const response = {
      data: merchants,
      meta: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    };

    await this.redisService.set(key, response, 300); // 5 menit
    return response;
  }

  async updateMerchantById(
    id: number,
    dto: Prisma.MerchantUpdateInput,
  ): Promise<Merchant> {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id },
    });

    if (!merchant) throw new NotFoundException('Merchant not found');

    const updated = await this.prisma.merchant.update({
      where: { id },
      data: dto,
    });

    await this.redisService.delete(this.merchantKey(id));

    return updated;
  }

  async findMerchantById(id: number): Promise<Merchant> {
    const key = this.merchantKey(id);
    const cached = await this.redisService.get<Merchant>(key);
    if (cached) return cached;

    const merchant = await this.prisma.merchant.findUnique({
      where: { id },
    });

    if (!merchant) return merchant;

    await this.redisService.set(key, merchant, 3600);
    return merchant;
  }

  async findExistingMerchantByEmail(email: string): Promise<Merchant> {
    return await this.prisma.merchant.findUnique({
      where: { email },
    });
  }

  async deleteMerchantById(id: number) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id },
    });

    if (!merchant) throw new NotFoundException('Merchant not found');

    await this.prisma.merchant.delete({
      where: { id },
    });

    await this.redisService.delete(this.merchantKey(id));

    return { success: true };
  }
}
