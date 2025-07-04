import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';
import { MailOptionsModel } from './models/mail-options.model';
import { IsNull, Repository } from 'typeorm';
import { EmailTemplateEntity } from './entities/email-template.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailTemplateModel } from './models/email-tempalte.model';

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

  async getTemplates(): Promise<EmailTemplateModel[]> {
    const template = await this.emailTemplateRepository.find({
      where: { deletedAt: IsNull() },
    });

    return template.map((entity) => entity.toModel());
  }

  async getTemplateById(templateId: number): Promise<EmailTemplateModel> {
    const template = await this.emailTemplateRepository.findOne({
      where: { id: templateId, deletedAt: IsNull() },
    });
    if (!template) {
      throw new Error('EmailTemplateEntity not found');
    }
    return template.toModel();
  }

  async createTemplate(
    name: string,
    subject: string,
    description: string,
    html: string,
    reqAccountId: number | undefined,
  ): Promise<EmailTemplateModel> {
    const entity = this.emailTemplateRepository.create({
      name: name,
      subject: subject,
      description: description,
      html: html,
      createdAt: new Date(),
      createdBy: reqAccountId,
    });
    const template = await this.emailTemplateRepository.save(entity);
    if (!reqAccountId) {
      await this.emailTemplateRepository.update(template.id, {
        createdBy: template.id,
      });
    }
    return await this.getTemplateById(template.id);
  }

  async updateTemplate(
    templateId: number,
    name: string | undefined,
    subject: string | undefined,
    description: string | undefined,
    html: string | undefined,
    reqAccountId: number | undefined,
  ): Promise<EmailTemplateModel> {
    await this.emailTemplateRepository.update(
      { id: templateId },
      {
        name: name,
        subject: subject,
        description: description,
        html: html,
        updatedAt: new Date(),
        updatedBy: reqAccountId,
      },
    );
    return await this.getTemplateById(templateId);
  }

  async deleteTemplate(templateId: number): Promise<void> {
    await this.emailTemplateRepository.softDelete(templateId);
  }
}
