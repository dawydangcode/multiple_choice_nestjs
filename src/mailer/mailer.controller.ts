import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Req,
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
import { EmailTemplateModel } from './models/email-tempalte.model';

@ApiTags('Mailer')
@Controller('api/v1/mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Get('template/list')
  async getTemplates(): Promise<EmailTemplateModel[]> {
    return await this.mailerService.getTemplates();
  }

  @Get('template/:templateId/detail')
  async getTemplate(@Param() params: GetEmailTemplateDto) {
    return await this.mailerService.getTemplateById(params.templateId);
  }

  @Post('template/create')
  async create(@Req() req: any, @Body() body: CreateEmailTemplateDto) {
    const reqAccountId = req.user.accountId || undefined;

    return await this.mailerService.createTemplate(
      body.name,
      body.subject,
      body.description,
      body.html,
      reqAccountId,
    );
  }

  @Put('template/:templateId/update')
  async update(
    @Req() req: any,
    @Param() params: UpdateEmailTemplateParamsDto,
    @Body() body: UpdateEmailTemplateBodyDto,
  ) {
    const reqAccountId = req.user.accountId || undefined;

    return await this.mailerService.updateTemplate(
      params.templateId,
      body.name,
      body.subject,
      body.description,
      body.html,
      reqAccountId,
    );
  }

  @Delete('template/:templateId/delete')
  async delete(@Param() params: DeleteEmailTemplateDto) {
    await this.mailerService.deleteTemplate(params.templateId);
  }
}
