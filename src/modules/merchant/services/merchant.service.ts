import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Merchant, Prisma } from '@prisma/client';
import { QueryMerchantDto } from '../dto/requests/query-merchant.dto';
import { UpdateMerchantDto } from '../dto/requests/update-merchant.dto';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { ServerPaginatedResponseDto } from '../../../common/app/dto/server-response.dto';
@Injectable()
export class MerchantService {
  constructor(private readonly prisma: PrismaService) {}
  async createMerchant(data: Prisma.MerchantCreateInput): Promise<Merchant> {
    const merchant = await this.prisma.merchant.create({
      data,
    });
    return merchant;
  }

  async findMerchants(
    query: QueryMerchantDto,
  ): Promise<ServerPaginatedResponseDto<Merchant>> {
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
    return {
      data: merchants,
      meta: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }

  async updateMerchantById(
    id: number,
    dto: Prisma.MerchantUpdateInput,
  ): Promise<Merchant> {
    const merchant = await this.findMerchantById(id);
    if (!merchant) throw new NotFoundException('Merchant not found');
    return await this.prisma.merchant.update({
      where: { id: merchant.id },
      data: dto,
    });
  }

  async findMerchantById(id: number): Promise<Merchant> {
    return await this.prisma.merchant.findUnique({
      where: { id },
    });
  }
  async findExistingMerchantByEmail(email: string): Promise<Merchant> {
    return await this.prisma.merchant.findUnique({
      where: { email },
    });
  }

  async deleteMerchantById(id: number) {
    const merchant = await this.findMerchantById(id);
    if (!merchant) throw new NotFoundException('Merchant not found');
    return await this.prisma.merchant.delete({
      where: { id },
    });
  }
}
