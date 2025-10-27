import { Module } from '@nestjs/common';
import { MerchantService } from './services/merchant.service';
import { MerchantController } from './controllers/merchant.controller'; 
import { PrismaModule } from '../../common/prisma/prisma.module';
@Module({
  imports: [PrismaModule],
  controllers: [MerchantController],
  providers: [MerchantService],
  exports: [MerchantService],
})
export class MerchantModule {}
