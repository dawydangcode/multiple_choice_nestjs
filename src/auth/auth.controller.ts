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

  @Post('auth/signup')
  async signUp(@Body() body: AuthSignUpBodyDto) {
    const role = await this.roleService.getRole(body.roleId);
    return await this.authService.signUp(body.username, body.password, role);
  }

  @Post('auth/signin')
  async signIn(@Body() body: AuthSignInBodyDto) {
    return this.authService.signIn(body.username, body.password);
  }

  @Post('auth/refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Put('auth/reset-password')
  async resetPassword() {
    return;
  }
}
