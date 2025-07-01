import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter, SendMailOptions } from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly nodemailerTransport: Transporter;
  private readonly logger = new Logger(MailerService.name);

  constructor(private readonly configService: ConfigService) {
    this.nodemailerTransport = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<string>('MAIL_PORT'),
      secure: this.configService.get<string>('MAIL_SECURE'),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendPasswordResetMail(to: string, token: string): Promise<void> {
    const resetLink = `${this.configService.get<string>('EMAIL_RESET_PASSWORD_URL')}?token=${token}`;
    const mailOptions = {
      from: `${this.configService.get<string>('MAILER_DEFAULT_NAME')} <${this.configService.get<string>('MAILER_DEFAULT_EMAIL')}>`,
      to: to,
      subject: 'Password Reset Request',
      html: `<p>Click the link below to reset your password:</p>
               <a href="${resetLink}">Reset Password</a>`,
    };

    await this.nodemailerTransport.sendMail(mailOptions);
  }
}
