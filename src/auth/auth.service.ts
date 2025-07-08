import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from 'src/account/account.service';
import * as bcrypt from 'bcrypt';
import { AccountModel } from 'src/account/models/account.model';
import { AccountDetailService } from 'src/account/modules/account-detail/account-detail.service';
import { RoleModel } from 'src/role/models/role.model';
import { ConfigService } from '@nestjs/config';
import { SessionService } from './modules/session/session.service';
import ms, { StringValue } from 'ms';
import { SessionModel } from './modules/session/model/session.model';
import * as moment from 'moment';
import { PayloadModel } from './models/payload.model';
import { RoleService } from 'src/role/role.service';
import { TokenModel } from './models/token.model';
import { MailerService } from 'src/mailer/mailer.service';
import { throwError } from 'src/utils/function';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { VerificationTokenEntity } from './entities/veriftcation-token.entity';
import { VerificationTokenModel } from './models/verify-token.model';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly accessTokenConfig = {
    secretKey: 'auth.jwt.accessToken.secret',
    expiresInKey: 'auth.jwt.accessToken.signOptions.expiresIn',
  };

  private readonly refreshTokenConfig = {
    secretKey: 'auth.jwt.refreshToken.secret',
    expiresInKey: 'auth.jwt.refreshToken.signOptions.expiresIn',
  };

  private readonly verifyTokenConfig = {
    secretKey: 'auth.jwt.verifyToken.secret',
    expiresInKey: 'auth.jwt.verifyToken.signOptions.expiresIn',
  };

  private generateTokenWithConfig(
    payload: PayloadModel,
    config: { secretKey: string; expiresInKey: string },
  ): { token: string; expireDate: Date } {
    const secret = this.configService.get<string>(config.secretKey);
    const expiresIn = this.configService.get<string>(config.expiresInKey);

    const token = this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });

    const expireDate = moment()
      .add(ms(expiresIn as StringValue), 'ms')
      .toDate();

    return { token, expireDate };
  }

  private generateAccessToken(payload: PayloadModel): {
    token: string;
    expireDate: Date;
  } {
    return this.generateTokenWithConfig(payload, this.accessTokenConfig);
  }

  private generateRefreshToken(payload: PayloadModel): {
    token: string;
    expireDate: Date;
  } {
    return this.generateTokenWithConfig(payload, this.refreshTokenConfig);
  }

  private generateVerifyToken(payload: any): {
    token: string;
    expireDate: Date;
  } {
    return this.generateTokenWithConfig(payload, this.verifyTokenConfig);
  }

  constructor(
    private readonly accountService: AccountService,
    private readonly accountDetailService: AccountDetailService,
    private readonly roleService: RoleService,
    private readonly sessionService: SessionService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(VerificationTokenEntity)
    private readonly verificationTokenRepository: Repository<VerificationTokenEntity>,
  ) {}

  async login(
    username: string,
    password: string,
    userAgent: string,
    ipAddress: string,
  ): Promise<TokenModel> {
    const account = await this.accountService.getAccountByUsername(
      username,
      false,
    );
    const role = await this.roleService.getRole(account.roleId);
    const isMatch = await bcrypt.compare(
      password,
      account.password ?? throwError('Not Found Password'),
    );

    if (!isMatch) {
      throw new UnauthorizedException('Username or password is invalid');
    }

    const session = await this.sessionService.createSession(
      account,
      userAgent,
      ipAddress,
      account.id,
    );

    const payload = new PayloadModel(
      account.id,
      session.id,
      account.email,
      account.roleId,
      role.name,
    );

    return await this.generateToken(payload);
  }

  async logout(session: SessionModel, reqAccountId: number): Promise<boolean> {
    await this.sessionService.updateSession(session, false, reqAccountId);
    return true;
  }

  async register(
    username: string,
    password: string,
    email: string,
    role: RoleModel,
    reqAccountId: number | undefined,
  ): Promise<AccountModel> {
    await this.accountService.getAccountByUsername(username, true);

    const newAccount = await this.accountService.createAccount(
      username,
      password,
      email,
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

    return await this.accountService.getAccount(newAccount.id, true);
  }

  async generateToken(payload: PayloadModel): Promise<TokenModel> {
    const plainPayload = { ...payload };

    const { token: accessToken, expireDate: accessExpireDate } =
      this.generateAccessToken(plainPayload);

    const { token: refreshToken, expireDate: refreshExpireDate } =
      this.generateRefreshToken(plainPayload);

    return new TokenModel(
      payload.accountId,
      accessToken,
      refreshToken,
      accessExpireDate,
      refreshExpireDate,
    );
  }

  async requestResetPassword(
    email: string,
    ipAddress: string | undefined,
    userAgent: string | undefined,
  ): Promise<boolean> {
    const account = await this.accountService.checkExistEmail(email);
    if (!account) {
      throw new UnauthorizedException('Email not exist');
    }

    await this.verificationTokenRepository.update(
      {
        email,
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
      {
        isUsed: true,
      },
    );

    const { token: resetToken } = this.generateVerifyToken({ email });

    const expiresAt = moment().add(15, 'minutes').toDate();

    const verificationToken = this.verificationTokenRepository.create({
      account_id: account.id,
      email,
      token: resetToken,
      ipAddress,
      userAgent,
      isUsed: false,
      createdAt: new Date(),
      expiresAt,
      deletedAt: undefined,
    });

    await this.verificationTokenRepository.save(verificationToken);

    const resetUrl = `${this.configService.get('EMAIL_RESET_PASSWORD_URL')}?token=${resetToken}`;

    await this.mailerService.sendMailWithTemplate('reset-password', email, {
      resetUrl,
      username: account.username,
      expiresIn: '15 minutes',
    });

    return true;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const verificationToken = await this.verificationTokenRepository.findOne({
      where: {
        token,
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!verificationToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const account = await this.accountService.getAccount(
      verificationToken.account_id,
      false,
    );

    await this.accountService.updateAccount(
      account,
      undefined,
      newPassword,
      undefined,
      undefined,
    );

    verificationToken.isUsed = true;
    await this.verificationTokenRepository.save(verificationToken);

    await this.verificationTokenRepository.update(
      {
        email: verificationToken.email,
        isUsed: false,
      },
      {
        isUsed: true,
      },
    );

    return true;
  }

  async changePassword(
    account: AccountModel,
    oldPassword: string,
    newPassword: string,
  ): Promise<AccountModel> {
    const isMatch = await bcrypt.compare(
      oldPassword,
      account.password ?? throwError('Not Found Password'),
    );
    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu cũ không đúng');
    }

    await this.accountService.updateAccount(
      account,
      undefined,
      newPassword,
      undefined,
      account.id,
    );

    return this.accountService.getAccount(account.id, true);
  }

  async cleanupExpiredVerificationTokens(): Promise<void> {
    await this.verificationTokenRepository.update(
      {
        expiresAt: LessThan(new Date()),
        isUsed: false,
      },
      {
        isUsed: true,
      },
    );
  }

  async getVerificationToken(
    token: string,
  ): Promise<VerificationTokenModel | null> {
    const verificationToken = await this.verificationTokenRepository.findOne({
      where: {
        token,
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
    });

    return verificationToken ? verificationToken.toModel() : null;
  }

  async invalidateVerificationTokensForEmail(email: string): Promise<void> {
    await this.verificationTokenRepository.update(
      {
        email,
        isUsed: false,
      },
      {
        isUsed: true,
      },
    );
  }

  // async requestResetPasswordOtp(email: string): Promise<void> {
  //   const account = await this.accountService.checkExistEmail(email);
  //   if (!account) {
  //     throw new UnauthorizedException('Email does not exist');
  //   }
  //   const otp = Math.floor(100000 + Math.random() * 900000).toString();
  //   const hashedOtp = await bcrypt.hash(otp, SALT_OR_ROUNDS);

  //   const expiresAt = new Date(Date.now() + ms('5m'));

  //   const otpRecord = this.otpRepository.create({
  //     accountId: account?.id,
  //     email,
  //     otpCode: hashedOtp,
  //     createdAt: new Date(),
  //     expiresAt,
  //     isUse: false,
  //   });

  //   await this.otpRepository.save(otpRecord);

  //   await this.mailerService.sendMail({
  //     to: email,
  //     subject: 'Password Reset OTP',
  //     html: `Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.`,
  //   });
  // }

  // async resetPassword(
  //   email: string,
  //   otp: string,
  //   newPassword: string,
  // ): Promise<void> {
  //   const otpRecord = await this.otpRepository.findOne({
  //     where: {
  //       email,
  //       isUse: false,
  //       expiresAt: MoreThan(new Date()),
  //     },
  //   });

  //   if (!otpRecord) {
  //     throw new BadRequestException('Invalid or expired OTP');
  //   }

  //   const isValid = await bcrypt.compare(otp, otpRecord.otpCode);
  //   if (!isValid) {
  //     throw new BadRequestException('Invalid OTP');
  //   }

  //   const hashedPassword = await bcrypt.hash(newPassword, 10);
  //   await this.accountService.updateAccount(
  //     await this.accountService.getAccount(otpRecord.accountId),
  //     undefined,
  //     hashedPassword,
  //     undefined,
  //     undefined,
  //   );

  //   otpRecord.isUse = true;
  //   await this.otpRepository.save(otpRecord);

  //   await this.otpRepository.delete({
  //     email,
  //     id: Not(otpRecord.id),
  //   });
  // }

  // async changePassword(
  //   accountId: number,
  //   oldPassword: string,
  //   newPassword: string,
  // ): Promise<void> {
  //   const account = await this.accountService.getAccount(accountId);

  //   const isMatch = await bcrypt.compare(oldPassword, account.password);
  //   if (!isMatch) {
  //     throw new UnauthorizedException('Old password is incorrect');
  //   }

  //   const hashedNewPassword = await bcrypt.hash(newPassword, SALT_OR_ROUNDS);
  //   await this.accountService.updateAccount(
  //     account,
  //     undefined,
  //     hashedNewPassword,
  //     undefined,
  //     accountId,
  //   );
  // }

  // async forgotPassword(email: string): Promise<void> {
  //   const payload = { email };

  //   const verifyToken = this.jwtService.sign(payload, {
  //     secret: this.configService.get<string>('auth.jwt.verifyToken.secret'),
  //   });
  //   const verifyTokenExpire = this.configService.get<string>(
  //     'auth.jwt.verifyToken.signOptions.expiresIn',
  //   );
  //   const verifyExpireDate = moment()
  //     .add(ms(verifyTokenExpire as StringValue), 'ms')
  //     .toDate();

  //   const user = await this.accountService.checkExistEmail(email);
  //   if (!user) {
  //     throw new BadRequestException('Email does not exist');
  //   }

  //   const url = `${this.configService.get('EMAIL_RESET_PASSWORD_URL')}?token=${verifyToken}`;
  //   const text = `Hi,\nTo reset your password, click here: ${url}`;

  //   await this.mailerService.sendMail({
  //     to: email,
  //     subject: 'Reset password',
  //     text,
  //   });
  // }
}
