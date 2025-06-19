import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignInBodyDto, AuthSignUpBodyDto } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { RoleService } from 'src/role/role.service';

@ApiTags('Auth')
@Controller('api/v1/')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly roleService: RoleService,
  ) {}

  @Post('auth/sign-up')
  async signUp(@Body() body: AuthSignUpBodyDto) {
    const role = await this.roleService.getRole(body.roleId);
    return await this.authService.signUp(body.username, body.password, role);
  }

  @Post('auth/sign-in')
  async signIn(@Body() body: AuthSignInBodyDto) {
    const result = await this.authService.signIn(body.username, body.password);
    return result;
  }

  @Post('auth/refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshAccessToken(body.refreshToken);
  }

  @Put('auth/reset-password')
  async resetPassword() {
    return;
  }
}
