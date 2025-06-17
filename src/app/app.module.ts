import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AccountModule } from '../account/account.module';
import { RoleModule } from '../role/role.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import database from 'src/config/database';
import app from 'src/config/app';
import { AuthModule } from 'src/auth/auth.module';
import { AccountDetailModel } from 'src/account/modules/account-detail/models/account-detail.model';
import { AccountDetailModule } from 'src/account/modules/account-detail/account-detail.module';
import { TokenModule } from 'src/auth/modules/token/token.module';

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
    TokenModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
