import { forwardRef, Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';
import { AccountDetailEntity } from './modules/account-detail/entities/account-detail.entity';
import { AccountDetailController } from './modules/account-detail/account-detail.controller';
import { AccountDetailService } from './modules/account-detail/account-detail.service';
import { AccountDetailModule } from './modules/account-detail/account-detail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity, AccountDetailEntity]),
    forwardRef(() => AccountDetailModule),
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
