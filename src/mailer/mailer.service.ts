import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { MailOptionsModel } from './models/mail-options.model';

@Injectable()
export class MailerService {
  constructor(
    @Inject('NODEMAILER_TRANSPORT')
    private readonly nodemailerTransport: Transporter,
    private readonly configService: ConfigService,
  ) {}

  async sendPasswordResetMail(
    mailOptions: MailOptionsModel,
    token: string,
  ): Promise<void> {
    const resetLink = `${this.configService.get<string>('EMAIL_RESET_PASSWORD_URL')}?token=${token}`;
    const mailData = {
      from: `${this.configService.get<string>('MAILER_DEFAULT_NAME')} <${this.configService.get<string>('MAILER_DEFAULT_EMAIL')}>`,
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html, //To do
    };

    await this.nodemailerTransport.sendMail(mailData);
  }

  async sendMail(options: any): Promise<void> {
    const mailData = {
      from: `${this.configService.get<string>('MAILER_DEFAULT_NAME')} <${this.configService.get<string>('MAILER_DEFAULT_EMAIL')}>`,
      ...options,
    };

    await this.nodemailerTransport.sendMail(mailData);
  }
}
