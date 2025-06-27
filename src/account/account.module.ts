import { forwardRef, Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';
import { AccountDetailEntity } from './modules/account-detail/entities/account-detail.entity';
import { AccountDetailModule } from './modules/account-detail/account-detail.module';
import { AuthModule } from 'src/auth/auth.module';
import { RoleService } from 'src/role/role.service';
import { RoleModule } from 'src/role/role.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity, AccountDetailEntity]),
    forwardRef(() => RoleModule),
    forwardRef(() => AccountDetailModule),
    forwardRef(() => UserModule),
    AuthModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
