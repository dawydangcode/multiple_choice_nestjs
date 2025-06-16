import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignUpBodyDto, AuthSignUpParamsDto } from './dto/auth.dto';
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
  async signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
}
