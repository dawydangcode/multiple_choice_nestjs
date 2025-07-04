import { Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplateEntity } from './entities/email-template.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [],
    }),
    TypeOrmModule.forFeature([EmailTemplateEntity]),
  ],
  controllers: [MailerController],
  providers: [
    MailerService,
    {
      provide: 'NODEMAILER_TRANSPORT',
      useFactory: (configService: ConfigService): Transporter => {
        return nodemailer.createTransport({
          host: configService.get<string>('MAIL_HOST'),
          port: Number(configService.get<string>('MAIL_PORT')),
          secure: configService.get<string>('MAIL_SECURE') === 'true',
          auth: {
            user: configService.get<string>('EMAIL_USER'),
            pass: configService.get<string>('EMAIL_PASSWORD'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [MailerService, TypeOrmModule],
})
export class MailerModule {}
