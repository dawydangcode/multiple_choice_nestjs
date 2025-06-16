import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from '../account/entities/account.entity';
import { JwtModule } from '@nestjs/jwt';
import { AccountModule } from '../account/account.module';
import { jwtConstants } from '../config/constants';
import { AuthController } from './auth.controller';
import { AccountDetailService } from 'src/account/modules/account-detail/account-detail.service';
import { AccountDetailEntity } from 'src/account/modules/account-detail/entities/account-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity, AccountDetailEntity]),
    forwardRef(() => AccountModule),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AccountDetailService],
  exports: [AuthService],
})
export class AuthModule {}
