import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';
import { TemplateService } from './modules/template/template.service';
import { MailOptionsModel } from './models/mail-options.model';

@Injectable()
export class MailerService {
  constructor(
    @Inject('NODEMAILER_TRANSPORT')
    private readonly nodemailerTransport: Transporter,
    private readonly configService: ConfigService,
    private readonly templateService: TemplateService,
  ) {}

  async sendMailWithTemplate(
    templateName: string,
    to: string,
    variables: Record<string, string>,
  ): Promise<MailOptionsModel> {
    const template = await this.templateService.getTemplateByName(templateName);

    let htmlContent = template.html;
    for (const [key, value] of Object.entries(variables)) {
      htmlContent = htmlContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    const fromEmail = `${this.configService.get<string>('MAILER_DEFAULT_NAME')} <${this.configService.get<string>('MAILER_DEFAULT_EMAIL')}>`;

    const mailData = {
      from: fromEmail,
      to,
      subject: template.subject,
      html: htmlContent,
    };

    await this.nodemailerTransport.sendMail(mailData);

    const mailOptionsModel = new MailOptionsModel(
      fromEmail,
      to,
      template.subject,
      '',
      htmlContent,
    );

    return mailOptionsModel;
  }
}
