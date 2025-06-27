import { forwardRef, Module } from '@nestjs/common';
import { AccountDetailController } from './account-detail.controller';
import { AccountDetailService } from './account-detail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountDetailEntity } from './entities/account-detail.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([AccountDetailEntity]),
  ],
  controllers: [AccountDetailController],
  providers: [AccountDetailService],
  exports: [AccountDetailService],
})
export class AccountDetailModule {}
