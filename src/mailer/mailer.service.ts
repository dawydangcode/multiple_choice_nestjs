import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import { MailerService } from 'src/config/mailer.service';

@Injectable()
export class MailsService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async forgotPassword(mailData: {
    to: string;
    data: {
      token: string;
      user_name: string;
    };
  }): Promise<void> {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: 'Reset Password',
      templatePath: path.join(
        this.configService.get<string>('mailer.workingDirectory', {
          infer: true,
        }) ??
          (() => {
            throw new Error('mailer.workingDirectory is not defined');
          })(),
        'src',
        'mails',
        'templates',
        'reset-password.hbs',
      ),
      context: {
        username: mailData.data.user_name,
        resetLink: `${this.configService.get<string>('app.clientURL')}/reset-password?token=${mailData.data.token}`,
      },
    });
  }
}
