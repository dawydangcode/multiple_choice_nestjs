import { Body, Controller, HttpCode, Post, Put, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignInBodyDto, AuthSignUpBodyDto } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { RoleService } from 'src/role/role.service';
import { Public } from 'src/middlewares/guards/jwt-auth.guard';
import { RoleType } from 'src/role/enum/role.enum';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly roleService: RoleService,
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
  @HttpCode(200)
  async logout(@Req() req: any) {
    return this.authService.logout(req);
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
