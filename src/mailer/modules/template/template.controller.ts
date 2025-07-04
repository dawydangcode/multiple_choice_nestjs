import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import {
  CreateEmailTemplateDto,
  DeleteEmailTemplateDto,
  GetEmailTemplateDto,
  UpdateEmailTemplateBodyDto,
  UpdateEmailTemplateParamsDto,
} from './dtos/email-template.dto';
import { TemplateService } from './template.service';
import { EmailTemplateModel } from './models/email-tempalte.model';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/middlewares/guards/role.guard';
import { Roles } from 'src/role/decorator/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';

@Roles(RoleType.Admin)
@Controller('api/v1')
@ApiTags('Template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get('template/list')
  async getTemplates(): Promise<EmailTemplateModel[]> {
    return await this.templateService.getTemplates();
  }

  @Get('template/:templateId/detail')
  async getTemplate(@Param() params: GetEmailTemplateDto) {
    return await this.templateService.getTemplateById(params.templateId);
  }

  @Post('template/create')
  async create(@Req() req: any, @Body() body: CreateEmailTemplateDto) {
    const reqAccountId = req.user.accountId || undefined;

    return await this.templateService.createTemplate(
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

    return await this.templateService.updateTemplate(
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
    await this.templateService.deleteTemplate(params.templateId);
  }
}
