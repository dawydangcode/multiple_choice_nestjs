import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';
import { MailOptionsModel } from './models/mail-options.model';
import { Repository } from 'typeorm';
import { EmailTemplateEntity } from './entities/email-template.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateEmailTemplateDto,
  UpdateEmailTemplateBodyDto,
} from './dtos/email-template.dto';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  constructor(
    @Inject('NODEMAILER_TRANSPORT')
    private readonly nodemailerTransport: Transporter,
    private readonly configService: ConfigService,
    @InjectRepository(EmailTemplateEntity)
    private readonly emailTemplateRepository: Repository<EmailTemplateEntity>,
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
  ): Promise<void> {
    const template = await this.emailTemplateRepository.findOne({
      where: { name: templateName },
    });

    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }

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
    this.logger.log(`Email sent to ${to} using template ${templateName}`);
  }

  async createTemplate(
    body: CreateEmailTemplateDto,
  ): Promise<EmailTemplateEntity> {
    const template = this.emailTemplateRepository.create(body);
    return await this.emailTemplateRepository.save(template);
  }

  async findAllTemplates(): Promise<EmailTemplateEntity[]> {
    return await this.emailTemplateRepository.find();
  }

  async getTemplateById(templateId: number): Promise<EmailTemplateEntity> {
    const template = await this.emailTemplateRepository.findOne({
      where: { id: templateId },
    });
    if (!template) {
      throw new Error('EmailTemplateEntity not found');
    }
    return template;
  }

  async updateTemplate(
    templateId: number,
    body: UpdateEmailTemplateBodyDto,
  ): Promise<EmailTemplateEntity> {
    await this.emailTemplateRepository.update(
      { id: templateId },
      {
        name: body.name,
        subject: body.subject,
        description: body.description,
        html: body.html,
      },
    );
    return await this.emailTemplateRepository.findOneOrFail({
      where: { id: templateId },
    });
  }

  async deleteTemplate(templateId: number): Promise<void> {
    await this.emailTemplateRepository.softDelete(templateId);
  }
}
