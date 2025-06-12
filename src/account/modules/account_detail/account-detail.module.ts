import { Module } from '@nestjs/common';
import { AccountDetailController } from './account-detail.controller';
import { AccountDetailService } from './account-detail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountDetailEntity } from './entities/account-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountDetailEntity])],
  controllers: [AccountDetailController],
  providers: [AccountDetailService],
})
export class AccountDetailModule {}
