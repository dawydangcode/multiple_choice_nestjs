import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AccountModule } from '../account/account.module';
import auth from '../config/auth';
import { AuthController } from './auth.controller';
import { RoleModule } from 'src/role/role.module';
import { AccountDetailModule } from 'src/account/modules/account-detail/account-detail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SessionModule } from './modules/session/session.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from 'src/account/modules/user/user.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationTokenEntity } from './entities/veriftcation-token.entity';

@Module({
  imports: [
    forwardRef(() => AccountModule),
    forwardRef(() => AccountDetailModule),
    forwardRef(() => RoleModule),
    forwardRef(() => SessionModule),
    forwardRef(() => UserModule),
    forwardRef(() => MailerModule),
    TypeOrmModule.forFeature([VerificationTokenEntity]),
    PassportModule,
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
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
