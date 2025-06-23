import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthLogoutBodyDto,
  AuthSignInBodyDto,
  AuthSignUpBodyDto,
} from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { RoleService } from 'src/role/role.service';
import { LocalAuthGuard } from 'src/middlewares/guards/local-auth.guard';
import { AccountModel } from 'src/account/models/account.model';
import { SessionService } from './modules/session/session.service';
import { JwtAuthGuard } from 'src/middlewares/guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private readonly roleService: RoleService,
  ) {}

  @Post('login')
  async login(@Request() req: any, @Body() body: AuthSignInBodyDto) {
    const userAgent = req.get('User-Agent');
    const ipAddress = req.ip || req.get('X-Forwarded-For');
    return await this.authService.login(
      body.username,
      body.password,
      userAgent,
      ipAddress,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Body() body: AuthLogoutBodyDto) {
    await this.authService.logout(body.sessionId);
    return true;
  }

  // @Post('auth/register')
  // async signUp(@Body() body: AuthSignUpBodyDto) {
  //   const role = await this.roleService.getRole(body.roleId);
  //   return await this.authService.signUp(body.username, body.password, role);
  // }

  // @Post('auth/login')
  // async signIn(@Body() body: AuthSignInBodyDto) {
  //   const result = await this.authService.signIn(body.username, body.password);
  //   return result;
  // }

  // @Post('auth/refresh-token')
  // async refreshToken(@Body() body: { refreshToken: string }) {
  //   return this.authService.refreshAccessToken(body.refreshToken);
  // }
  @Put('auth/reset-password')
  async resetPassword() {
    return;
  }
}
