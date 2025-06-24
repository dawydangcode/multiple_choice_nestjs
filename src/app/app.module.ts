import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AccountModule } from '../account/account.module';
import { RoleModule } from '../role/role.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { AccountDetailModule } from 'src/account/modules/account-detail/account-detail.module';
import { SessionModule } from 'src/auth/modules/session/session.module';
import { JwtAuthGuard } from 'src/middlewares/guards/jwt-auth.guard';
import { RolesGuard } from 'src/middlewares/guards/role.guard';
import database from 'src/config/database';
import app from 'src/config/app';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [database, app],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.get<any>('database') as TypeOrmModuleAsyncOptions;
      },
    }),
    AccountModule,
    AccountDetailModule,
    RoleModule,
    AuthModule,
    SessionModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
