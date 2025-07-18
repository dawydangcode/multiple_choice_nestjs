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
import { UserModule } from 'src/account/modules/user/user.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { TemplateModule } from 'src/mailer/modules/template/template.module';
import auth from 'src/config/auth';
import { ExamModule } from 'src/exam/exam.module';
import { QuestionModule } from 'src/question/question.module';
import { PickExamModule } from 'src/exam/modules/pick-exam/pick-exam.module';
import { PickExamDetailModule } from 'src/exam/modules/pick-exam-detail/pick-exam-detail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [database, app, auth],
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
    UserModule,
    MailerModule,
    TemplateModule,
    ExamModule,
    QuestionModule,
    PickExamModule,
    PickExamDetailModule,
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
