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
import { MailerModule } from '@nestjs-modules/mailer';
import { config } from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from './entities/otp.entity';

@Module({
  imports: [
    forwardRef(() => AccountModule),
    forwardRef(() => AccountDetailModule),
    forwardRef(() => RoleModule),
    forwardRef(() => SessionModule),
    forwardRef(() => UserModule),
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
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: Number(configService.get<string>('MAIL_PORT')),
          secure: configService.get<string>('MAIL_SECURE') === 'true',
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: `"${configService.get<string>('MAILER_DEFAULT_NAME')}" <${configService.get<string>('MAILER_DEFAULT_EMAIL')}>`,
        },
      }),
    }),
    // TypeOrmModule.forFeature([OtpEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
