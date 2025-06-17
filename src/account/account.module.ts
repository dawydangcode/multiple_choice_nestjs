import { forwardRef, Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';
import { AccountDetailEntity } from './modules/account-detail/entities/account-detail.entity';
import { AccountDetailModule } from './modules/account-detail/account-detail.module';
import { AuthMechanism } from 'typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TokenModel } from 'src/auth/modules/token/model/token.model';
import { TokenModule } from 'src/auth/modules/token/token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity, AccountDetailEntity]),
    forwardRef(() => AccountDetailModule),
    forwardRef(() => TokenModule),
    AuthModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
