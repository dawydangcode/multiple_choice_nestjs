import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from '../account/entities/account.entity';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AccountModule } from '../account/account.module';
import auth from '../config/auth';
import { AuthController } from './auth.controller';
import { AccountDetailService } from 'src/account/modules/account-detail/account-detail.service';
import { AccountDetailEntity } from 'src/account/modules/account-detail/entities/account-detail.entity';
import { RoleModule } from 'src/role/role.module';
import { AccountDetailModule } from 'src/account/modules/account-detail/account-detail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => AccountModule),
    forwardRef(() => AccountDetailModule),
    forwardRef(() => RoleModule),
    ConfigModule.forRoot({
      load: [auth],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.get('auth.jwt') as JwtModuleOptions;
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
