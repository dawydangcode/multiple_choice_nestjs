import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from 'src/account/account.service';
import * as bcrypt from 'bcrypt';
import { AccountModel } from 'src/account/models/account.model';
import { AccountDetailService } from 'src/account/modules/account-detail/account-detail.service';
import { ADMIN_ACCOUNT_ID } from 'src/utils/constant';
import { RoleModel } from 'src/role/models/role.model';
import { ConfigService } from '@nestjs/config';
import { TokenModel } from './modules/token/model/token.model';
import { TokenService } from './modules/token/token.service';
import { add } from 'date-fns';
import { ExpireTimeUtil, throwError } from 'src/utils/function';
import { TokenEntity } from './modules/token/entity/token.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly accountDetailService: AccountDetailService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(
    username: string,
    password: string,
    role: RoleModel,
  ): Promise<AccountModel> {
    await this.accountService.checkExistUsername(username);

    const newAccount = await this.accountService.createAccount(
      username,
      password,
      role.id,
      ADMIN_ACCOUNT_ID,
    );

    await this.accountDetailService.createAccountDetail(
      newAccount.id,
      undefined,
      undefined,
      undefined,
      undefined,
      newAccount.id,
    );

    return await this.accountService.getAccount(newAccount.id);
  }

  async signIn(
    username: string,
    password: string,
    userAgent?: string,
    ipAddress?: string,
    sessionId?: string,
  ): Promise<TokenModel> {
    const account = await this.accountService.getAccountByUsername(username);

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      accountId: account.id,
      roleId: account.roleId,
    };

    const accessSecret = this.configService.get<string>('auth.jwt.secret');
    const accessExpire = this.configService.get<string>(
      'auth.jwt.signOptions.expiresIn',
    );
    const refreshSecret = this.configService.get<string>(
      'auth.refreshToken.secret',
    );
    const refreshExpire = this.configService.get<string>(
      'auth.refreshToken.signOptions.expiresIn',
    );

    const accessToken = this.jwtService.sign(payload, {
      secret: accessSecret,
      expiresIn: accessExpire,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpire,
    });

    const expiresAt = add(
      new Date(),
      ExpireTimeUtil.parseExpireTimeForDateFns(accessExpire ?? '1h'),
    );

    const refreshExpiresAt = add(
      new Date(),
      ExpireTimeUtil.parseExpireTimeForDateFns(refreshExpire ?? '7d'),
    );

    const tokenEntity = await this.tokenService.createToken(
      account.id,
      accessToken,
      expiresAt,
      refreshExpiresAt,
      refreshToken,
      userAgent,
      ipAddress,
      sessionId,
    );

    return tokenEntity;
  }

  async refreshToken(refreshToken: string): Promise<TokenModel> {
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('auth.refreshToken.secret'),
    }) as {
      accountId: number;
      roleId: number;
    };

    const account = await this.accountService.getAccount(payload.accountId);

    const existingToken = await this.tokenService.getLatestTokenByAccountId(
      account.id,
      false,
    );
    if (!existingToken || existingToken.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newAccessToken = this.jwtService.sign(
      { accountId: account.id, roleId: account.roleId },
      {
        secret: this.configService.get<string>('auth.jwt.secret'),
        expiresIn: this.configService.get<string>(
          'auth.jwt.signOptions.expiresIn',
        ),
      },
    );

    const newRefreshToken = this.jwtService.sign(
      { accountId: account.id, roleId: account.roleId },
      {
        secret: this.configService.get<string>('auth.refreshToken.secret'),
        expiresIn: this.configService.get<string>(
          'auth.refreshToken.signOptions.expiresIn',
        ),
      },
    );

    const expiresAt = add(
      new Date(),
      ExpireTimeUtil.parseExpireTimeForDateFns(
        this.configService.get<string>('auth.jwt.signOptions.expiresIn') ??
          throwError(),
      ),
    );

    const refreshExpiresAt = add(
      new Date(),
      ExpireTimeUtil.parseExpireTimeForDateFns(
        this.configService.get<string>(
          'auth.refreshToken.signOptions.expiresIn',
        ) ?? '7d',
      ),
    );

    const updatedTokenEntity = await this.tokenService.updateToken(
      existingToken.id,
      account.id,
      newAccessToken,
      expiresAt,
      refreshExpiresAt,
      newRefreshToken,
      existingToken.userAgent,
      existingToken.ipAddress,
      existingToken.sessionId,
    );

    return updatedTokenEntity.toModel();
  }
}
