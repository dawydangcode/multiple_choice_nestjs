import { Body, Controller, Post, Put, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthSignInBodyDto,
  AuthSignUpBodyDto,
  ChangePasswordBodyDto,
  RequestResetPasswordBodyDto,
  ResetPasswordBodyDto,
} from './dtos/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { RoleService } from 'src/role/role.service';
import { Public } from 'src/middlewares/guards/jwt-auth.guard';
import { RoleType } from 'src/role/enum/role.enum';
import { RequestModel } from 'src/utils/models/request.model';
import { SessionService } from './modules/session/session.service';
import { UserService } from 'src/account/modules/user/user.service';
import { AccountService } from 'src/account/account.service';
import { SessionType } from './modules/session/enums/session.type';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
    private readonly roleService: RoleService,
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
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
    const account = await this.authService.register(
      body.username,
      body.password,
      body.email,
      role,
      undefined,
    );
    const user = await this.userService.createUser(account);
    return account;
  }

  @Public()
  @Post('forgot-password/send-mail')
  async requestForgotPassword(
    @Req() req: any,
    @Body() body: RequestResetPasswordBodyDto,
  ) {
    const userAgent = req.get('User-Agent');
    const ipAddress = req.ip || req.get('X-Forwarded-For');
    const account = await this.accountService.getAccountByEmail(body.email);
    if (!account) {
      throw new Error('Account not found');
    }
    const session = await this.sessionService.createSession(
      account,
      req.get('User-Agent'),
      req.ip || req.get('X-Forwarded-For'),
      SessionType.RESET_PASSWORD,
      account.id,
    );
    await this.authService.requestResetPassword(session, account, body.email);
    return true;
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordBodyDto) {
    await this.authService.resetPassword(body.token, body.newPassword);
    return true;
  }

  @Post('change-password')
  async changePassword(
    @Req() req: RequestModel,
    @Body() body: ChangePasswordBodyDto,
  ) {
    const account = await this.accountService.getAccount(
      req.user.accountId,
      false,
    );
    return await this.authService.changePassword(
      account,
      body.oldPassword,
      body.newPassword,
    );
  }

  // @Post('request-reset-password-authenticated')
  // async requestResetPasswordAuthenticated(@Req() req: RequestModel) {
  //   const email = req.user.email;
  //   await this.authService.requestResetPasswordOtp(email);
  //   return true;
  // }

  // @Post('reset-password-authenticated')
  // async resetPasswordAuthenticated(
  //   @Req() req: RequestModel,
  //   @Body() body: ResetPasswordBodyDto,
  // ) {
  //   const email = req.user.email;
  //   await this.authService.resetPassword(email, body.otpCode, body.newPassword);
  //   return true;
  // }

  // @Post('change-password')
  // async changePassword(
  //   @Req() req: RequestModel,
  //   @Body() body: ChangePasswordBodyDto,
  // ) {
  //   await this.authService.changePassword(
  //     req.user.accountId,
  //     body.oldPassword,
  //     body.newPassword,
  //   );
  //   return true;
  // }

  // @Public()
  // @Post('forgot-password')
  // async forgotPassword(@Body() body: RequestOtpBodyDto): Promise<void> {
  //   return this.authService.forgotPassword(body.email);
  // }

  // @Public()
  // @Post('reset-password')
  // async resetPassword(
  //   @Req() req: RequestModel,
  //   @Body() body: ResetPasswordBodyDto,
  // ): Promise<void> {
  //   return this.authService.resetPassword(
  //     req.user.email,
  //     body.otpCode,
  //     body.newPassword,
  //   );
  // }
}
