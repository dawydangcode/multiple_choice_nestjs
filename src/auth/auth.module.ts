import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccountModel } from 'src/account/models/account.model';
import { AccountModule } from 'src/account/account.module';
import { jwtConstants } from 'src/config/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'src/account/entities/account.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    forwardRef(() => AccountModule),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forFeature([AccountEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
