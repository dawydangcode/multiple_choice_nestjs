import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from 'src/account/account.service';
import * as bcrypt from 'bcrypt';
import { AccountEntity } from 'src/account/entities/account.entity';
import { AccountModel } from 'src/account/models/account.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountDetailService } from 'src/account/modules/account-detail/account-detail.service';
import { SALT_OR_ROUNDS } from './constants/auth.const';
import { ADMIN_ACCOUNT_ID } from 'src/utils/constant';
import { RoleModel } from 'src/role/models/role.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly accountDetailService: AccountDetailService,
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
  ): Promise<{ access_token: string; refresh_token: string }> {
    const account = await this.accountService.getAccountByUsername(username);

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      accountId: account.id,
      roleId: account.roleId,
    };

    const refresh_secret = this.configService.get<string>('auth.jwt.secret');
    const refresh_expire = this.configService.get<string>(
      'auth.refreshToken.signOptions.expiresIn',
    );

    const refreshToken = this.jwtService.sign(payload, {
      secret: refresh_secret,
      expiresIn: refresh_expire,
    });
    const accessToken = await this.jwtService.signAsync(payload); // TO DO

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
