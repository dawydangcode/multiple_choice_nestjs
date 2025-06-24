import { Body, Controller, HttpCode, Post, Put, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignInBodyDto, AuthSignUpBodyDto } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { RoleService } from 'src/role/role.service';
import { Public } from 'src/middlewares/guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly roleService: RoleService,
  ) {}

  @Public()
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

  @Post('logout')
  @HttpCode(200)
  async logout(@Request() req) {
    return this.authService.logout(req);
  }

  @Public()
  @Post('register')
  async signUp(@Body() body: AuthSignUpBodyDto) {
    const role = await this.roleService.getDefaultRole();

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
