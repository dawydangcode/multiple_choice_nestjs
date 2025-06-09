import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../account/account.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'sapassword',
      database: 'multiple_choice',
      synchronize: false,
      autoLoadEntities: true,
    }),
    AccountModule,
    RoleModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
