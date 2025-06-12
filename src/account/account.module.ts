import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';
import { AccountDetailEntity } from './modules/account_detail/entities/account-detail.entity';
import { AccountDetailController } from './modules/account_detail/account-detail.controller';
import { AccountDetailService } from './modules/account_detail/account-detail.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity, AccountDetailEntity])],
  controllers: [AccountController, AccountDetailController],
  providers: [AccountService, AccountDetailService],
})
export class AccountModule {}
