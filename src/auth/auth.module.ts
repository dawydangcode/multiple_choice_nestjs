import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from '../account/entities/account.entity';
import { JwtModule } from '@nestjs/jwt';
import { AccountModule } from '../account/account.module';
import { jwtConstants } from '../config/constants';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    forwardRef(() => AccountModule),
    TypeOrmModule.forFeature([AccountEntity]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
