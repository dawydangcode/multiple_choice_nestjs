import { Controller, Delete, Get, Param, Req } from '@nestjs/common';
import { SessionService } from './session.service';
import { ApiTags } from '@nestjs/swagger';
import { GetSessionParamsDto } from './dto/session.dto';
import { SessionModel } from './model/session.model';

@ApiTags('session')
@Controller('api/v1')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('session/:id/get')
  async getSession(
    @Param() params: GetSessionParamsDto,
  ): Promise<SessionModel> {
    return this.sessionService.getSessionById(params.sessionId);
  }

  @Get('session/current')
  async getCurrentSession(
    @Req() req: Request & { sessionId: number },
  ): Promise<SessionModel> {
    return this.sessionService.getSessionById(req.sessionId);
  }

  @Delete('session/:id/delete')
  async revokeSession(@Param('id') id: number): Promise<void> {
    await this.sessionService.revokeSession(id);
  }
}
