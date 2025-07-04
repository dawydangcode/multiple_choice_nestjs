import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ApiTags } from '@nestjs/swagger';
import { EmailTemplateEntity } from './entities/email-template.entity';
import {
  CreateEmailTemplateDto,
  DeleteEmailTemplateDto,
  GetEmailTemplateDto,
  UpdateEmailTemplateBodyDto,
  UpdateEmailTemplateParamsDto,
} from './dtos/email-template.dto';

@ApiTags('Mailer')
@Controller('api/v1/mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post()
  async create(
    @Body() body: CreateEmailTemplateDto,
  ): Promise<EmailTemplateEntity> {
    return await this.mailerService.createTemplate(body);
  }

  @Get()
  async findAll(): Promise<EmailTemplateEntity[]> {
    return await this.mailerService.findAllTemplates();
  }

  @Get('template/:templateId/detail')
  async getTemplate(
    @Param() params: GetEmailTemplateDto,
  ): Promise<EmailTemplateEntity> {
    return await this.mailerService.getTemplateById(params.templateId);
  }

  @Put('template/:templateId/update')
  async update(
    @Param() params: UpdateEmailTemplateParamsDto,
    @Body() body: UpdateEmailTemplateBodyDto,
  ): Promise<EmailTemplateEntity> {
    return await this.mailerService.updateTemplate(params.templateId, body);
  }

  @Delete('template/:templateId/delete')
  async delete(@Param() params: DeleteEmailTemplateDto): Promise<void> {
    await this.mailerService.deleteTemplate(params.templateId);
  }
}
