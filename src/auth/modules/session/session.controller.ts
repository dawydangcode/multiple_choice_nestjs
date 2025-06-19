import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Session')
@Controller('api/v1')
export class SessionController {}
