import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'; 
import { Prisma, User } from '@prisma/client';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ServerPaginatedResponseDto } from '../../common/app/dto/server-response.dto';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const user = await this.prisma.user.create({
      data,
    });
    return user;
  }

  async findUsers(
    query: QueryUserDto,
  ): Promise<ServerPaginatedResponseDto<User>> {
    const { limit = 10, page = 1, search } = query;
    const where: Prisma.UserWhereInput = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
      ];
    }
    const users = await this.prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
    const total = await this.prisma.user.count({ where });
    return {
      data: users,
      meta: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }

  async updateUserById(id: number, dto: Prisma.UserUpdateInput): Promise<User> {
    const user = await this.findUserById(id);
    if (!user) throw new NotFoundException('User not found');
    return await this.prisma.user.update({
      where: { id: user.id },
      data: dto,
    });
  }

  async findUserById(id: number): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }
  async findExistingUserByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async deleteUserById(id: number) {
    const user = await this.findUserById(id);
    if (!user) throw new NotFoundException('User not found');
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
