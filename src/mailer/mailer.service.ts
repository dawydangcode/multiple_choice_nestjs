import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';
import { MailOptionsModel } from './models/mail-options.model';
import { Repository } from 'typeorm';
import { EmailTemplateEntity } from './modules/template/entities/email-template.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Template } from 'handlebars';
import { TemplateService } from './modules/template/template.service';

@Injectable()
export class MailerService {
  constructor(
    @Inject('NODEMAILER_TRANSPORT')
    private readonly nodemailerTransport: Transporter,
    private readonly configService: ConfigService,
    private readonly templateService: TemplateService,
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
      html: mailOptions.html,
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

  async sendMailWithTemplate(
    templateName: string,
    to: string,
    variables: Record<string, string>,
  ): Promise<boolean> {
    const template = await this.templateService.getTemplateByName(templateName);

    let htmlContent = template.html;
    for (const [key, value] of Object.entries(variables)) {
      htmlContent = htmlContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    const mailData = {
      from: `${this.configService.get<string>('MAILER_DEFAULT_NAME')} <${this.configService.get<string>('MAILER_DEFAULT_EMAIL')}>`,
      to,
      subject: template.subject,
      html: htmlContent,
    };

    await this.nodemailerTransport.sendMail(mailData);
    return true;
  }
}
