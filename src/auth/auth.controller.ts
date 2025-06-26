import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignInBodyDto, AuthSignUpBodyDto } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { RoleService } from 'src/role/role.service';
import { Public } from 'src/middlewares/guards/jwt-auth.guard';
import { RoleType } from 'src/role/enum/role.enum';
import { PayloadModel } from './model/payload.model';
import { session } from 'passport';
import { RequestModel } from 'src/utils/models/request.model';
import { SessionService } from './modules/session/session.service';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly roleService: RoleService,
    private readonly sessionService: SessionService,
  ) {}

  @Public()
  @Post('login')
  async login(@Req() req: any, @Body() body: AuthSignInBodyDto) {
    const userAgent = req.get('User-Agent');
    const ipAddress = req.ip || req.get('X-Forwarded-For');

    return await this.authService.login(
      body.username,
      body.password,
      userAgent,
      ipAddress,
    );
  }

  @Post('logout')
  async logout(@Req() req: RequestModel) {
    const sessionId = req.user.sessionId;
    const session = await this.sessionService.getSessionById(sessionId, true);
    return await this.authService.logout(session, req.user.accountId);
  }

  @Public()
  @Post('register')
  async signUp(@Body() body: AuthSignUpBodyDto) {
    const role = await this.roleService.getRoleByName(RoleType.User);

    return await this.authService.register(
      body.username,
      body.password,
      role,
      undefined,
    );
  }

  @Put('change-password')
  async changePassword() {}

  @Put('auth/reset-password')
  async resetPassword() {
    return;
  }
}
