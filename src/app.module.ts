import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AccountModule } from './account/account.module';
import { Account } from './account/account.entity';
import { RoleModule } from './role/role.module';
import { Role } from './role/role.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'sapassword',
      database: 'multiple_choice',
      entities: [Account, Role],
      synchronize: true,
    }), AccountModule, RoleModule,
  ],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource){}
}
