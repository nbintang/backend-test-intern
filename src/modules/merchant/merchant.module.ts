import { Module } from '@nestjs/common';
import { MerchantService } from './services/merchant.service';
import { MerchantController } from './controllers/merchant.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { RedisModule } from '../../common/redis/redis.module';
@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [MerchantController],
  providers: [MerchantService],
  exports: [MerchantService],
})
export class MerchantModule {}
