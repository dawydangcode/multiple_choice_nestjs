import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignInBodyDto, AuthSignUpBodyDto } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('api/v1/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/signup')
  async signUp(@Body() body: AuthSignUpBodyDto) {
    return await this.authService.signUp(
      body.username,
      body.password,
      body.roleId,
    );
  }

  @Post('auth/signin')
  async signIn(@Body() body: AuthSignInBodyDto) {
    return this.authService.signIn(body.username, body.password);
  }
}
