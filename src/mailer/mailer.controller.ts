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
import { EmailTemplateEntity } from './modules/template/entities/email-template.entity';
import {
  CreateEmailTemplateDto,
  DeleteEmailTemplateDto,
  GetEmailTemplateDto,
  UpdateEmailTemplateBodyDto,
  UpdateEmailTemplateParamsDto,
} from './modules/template/dtos/email-template.dto';
import { EmailTemplateModel } from './modules/template/models/email-tempalte.model';

@ApiTags('Mailer')
@Controller('api/v1/mailer')
export class MailerController {
  
}
