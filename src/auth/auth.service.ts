import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from 'src/account/account.service';
import * as bcrypt from 'bcrypt';
import { AccountModel } from 'src/account/models/account.model';
import { AccountDetailService } from 'src/account/modules/account-detail/account-detail.service';
import { ADMIN_ACCOUNT_ID } from 'src/utils/constant';
import { RoleModel } from 'src/role/models/role.model';
import { ConfigService } from '@nestjs/config';
import { SessionService } from './modules/session/session.service';
import ms, { StringValue } from 'ms';
import { SessionModel } from './modules/session/model/session.model';
@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly accountDetailService: AccountDetailService,
    private readonly sessionService: SessionService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(
    username: string,
    password: string,
    userAgent: string,
    ipAddress: string,
  ): Promise<Partial<SessionModel>> {
    const account = await this.accountService.getAccountByUsername(username);
    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      throw new UnauthorizedException('Username or password is invalid');
    }

    const session = await this.sessionService.createSession(
      account,
      userAgent,
      ipAddress,
      account.id,
    );

    const payload = {
      username: account.username,
      sub: account.id,
      roleId: account.roleId,
      sessionId: session.id,
    };

    const { accessToken, refreshToken, accessExpireDate, refreshExpireDate } =
      await this.generateToken(payload);

    return {
      id: session.id,
      accountId: account.id,
      accessToken,
      refreshToken,
      accessExpire: accessExpireDate,
      refreshExpire: refreshExpireDate,
    };
  }

  async logout(@Request() req): Promise<boolean> {
    const authHeader = req.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Authorization header is missing or invalid',
      );
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token);
    const payload = this.jwtService.verify(token, {
      secret: this.configService.get<string>('auth.jwt.accessToken.secret'),
    });
    console.log('Payload:', payload);

    const sessionId = payload.sessionId;

    await this.sessionService.updateActiveState(sessionId);

    return true;
  }

  async register(
    username: string,
    password: string,
    role: RoleModel,
    reqAccountId: number | undefined,
  ): Promise<AccountModel> {
    await this.accountService.checkExistUsername(username);

    const newAccount = await this.accountService.createAccount(
      username,
      password,
      role.id,
      reqAccountId,
    );

    await this.accountDetailService.createAccountDetail(
      newAccount.id,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );

    return await this.accountService.getAccount(newAccount.id);
  }

  async generateToken(payload: any) {
    const accessSecret = this.configService.get<string>(
      'auth.jwt.accessToken.secret',
    );
    const accessExpire = this.configService.get<string>(
      'auth.jwt.accessToken.signOptions.expiresIn',
    );
    const refreshSecret = this.configService.get<string>(
      'auth.jwt.refreshToken.secret',
    );
    const refreshExpire = this.configService.get<string>(
      'auth.jwt.refreshToken.signOptions.expiresIn',
    );

    const accessToken = this.jwtService.sign(payload, {
      secret: accessSecret,
      expiresIn: accessExpire,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpire,
    });

    const accessExpireDate =
      typeof accessExpire === 'string'
        ? new Date(Date.now() + ms(accessExpire as StringValue))
        : undefined;
    const refreshExpireDate =
      typeof refreshExpire === 'string'
        ? new Date(Date.now() + ms(refreshExpire as StringValue))
        : undefined;

    return {
      accessToken,
      refreshToken,
      accessExpireDate,
      refreshExpireDate,
    };
  }
  // async signIn(username: string, password: string): Promise<SessionModel> {
  //   const account = await this.accountService.getAccountByUsername(username);
  //   const isMatch = await bcrypt.compare(password, account.password);
  //   if (!isMatch) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   const payload = {
  //     accountId: account.id,
  //     roleId: account.roleId,
  //     userAgent: '',
  //     ipAddress: '',
  //     isRevoke: false,
  //   };

  //   const accessSecret = this.configService.get<string>(
  //     'auth.jwt.accessToken.secret',
  //   );
  //   const accessExpire = this.configService.get<string>(
  //     'auth.jwt.accessToken.signOptions.expiresIn',
  //   );
  //   const refreshSecret = this.configService.get<string>(
  //     'auth.jwt.refreshToken.secret',
  //   );
  //   const refreshExpire = this.configService.get<string>(
  //     'auth.jwt.refreshToken.signOptions.expiresIn',
  //   ); //TO DO

  //   const accessToken = this.jwtService.sign(payload, {
  //     secret: accessSecret,
  //     expiresIn: accessExpire,
  //   });
  //   const refreshToken = this.jwtService.sign(payload, {
  //     secret: refreshSecret,
  //     expiresIn: refreshExpire,
  //   });

  //   return;
  // }

  // async refreshAccessToken(refreshToken: string): Promise<TokenModel> {
  //   const payload = this.jwtService.verify(refreshToken, {
  //     secret: this.configService.get<string>('auth.refreshToken.secret'),
  //   }) as {
  //     accountId: number;
  //     roleId: number;
  //   };

  //   const account = await this.accountService.getAccount(payload.accountId);

  //   const existingToken = await this.tokenService.getLatestTokenByAccountId(
  //     account.id,
  //     false,
  //   );
  //   if (existingToken.refreshToken !== refreshToken) {
  //     throw new UnauthorizedException('Invalid refresh token');
  //   }

  //   const newAccessToken = this.jwtService.sign(
  //     {
  //       accountId: account.id,
  //       roleId: account.roleId,
  //     },
  //     {
  //       secret: this.configService.get<string>('auth.jwt.secret'),
  //       expiresIn: this.configService.get<string>(
  //         'auth.jwt.signOptions.expiresIn',
  //       ),
  //     },
  //   );

  //   const newRefreshToken = this.jwtService.sign(
  //     { accountId: account.id, roleId: account.roleId },
  //     {
  //       secret: this.configService.get<string>('auth.refreshToken.secret'),
  //       expiresIn: this.configService.get<string>(
  //         'auth.refreshToken.signOptions.expiresIn',
  //       ),
  //     },
  //   );

  //   const expiresAt = add(
  //     new Date(),
  //     ExpireTimeUtil.parseExpireTimeForDateFns(
  //       this.configService.get<string>('auth.jwt.signOptions.expiresIn') ??
  //         throwError(),
  //     ),
  //   );

  //   const refreshExpiresAt = add(
  //     new Date(),
  //     ExpireTimeUtil.parseExpireTimeForDateFns(
  //       this.configService.get<string>(
  //         'auth.refreshToken.signOptions.expiresIn',
  //       ) ?? '7d',
  //     ),
  //   );

  //   const updatedTokenEntity = await this.tokenService.updateToken(
  //     existingToken.id,
  //     account.id,
  //     newAccessToken,
  //     expiresAt,
  //     refreshExpiresAt,
  //     newRefreshToken,
  //     existingToken.userAgent,
  //     existingToken.ipAddress,
  //     existingToken.sessionId,
  //   );

  //   return updatedTokenEntity.toModel();
  // }
}
