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
import { PayloadModel } from './model/payload.model';
import { RoleService } from 'src/role/role.service';
import { TokenModel } from './model/token.model';
import { SALT_OR_ROUNDS } from './constants/auth.const';
import { OtpEntity } from './entities/otp.entity';
import { MoreThan, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly accountDetailService: AccountDetailService,
    private readonly roleService: RoleService,
    private readonly sessionService: SessionService,
    @InjectRepository(OtpEntity)
    private readonly otpRepository: Repository<OtpEntity>,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(
    username: string,
    password: string,
    userAgent: string,
    ipAddress: string,
  ): Promise<TokenModel> {
    const account = await this.accountService.getAccountByUsername(username);
    const role = await this.roleService.getRole(account.roleId);
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

    const payload = new PayloadModel(
      account.id,
      session.id,
      account.email,
      account.roleId,
      role.name,
    );

    const { accessToken, refreshToken, accessExpireDate, refreshExpireDate } =
      await this.generateToken(payload);

    return {
      accountId: account.id,
      accessToken: accessToken,
      refreshToken: refreshToken,
      accessExpireDate: accessExpireDate,
      refreshExpireDate: refreshExpireDate,
    };
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
    await this.accountService.checkExistUsername(username);

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

    return await this.accountService.getAccount(newAccount.id);
  }

  async generateToken(payload: PayloadModel): Promise<TokenModel> {
    const plainPayload = { ...payload };

    const accessSecret = this.configService.get<string>(
      'auth.jwt.accessToken.secret',
    );
    const accessExpire = this.configService.get<string>(
      'auth.jwt.accessToken.signOptions.expiresIn',
    );
    const accessToken = this.jwtService.sign(plainPayload, {
      secret: accessSecret,
      expiresIn: accessExpire,
    });
    const accessExpireDate = moment()
      .add(ms(accessExpire as StringValue), 'ms')
      .toDate();

    const refreshSecret = this.configService.get<string>(
      'auth.jwt.refreshToken.secret',
    );
    const refreshExpire = this.configService.get<string>(
      'auth.jwt.refreshToken.signOptions.expiresIn',
    );
    const refreshToken = this.jwtService.sign(plainPayload, {
      secret: refreshSecret,
      expiresIn: refreshExpire,
    });

    const refreshExpireDate = moment()
      .add(ms(refreshExpire as StringValue), 'ms')
      .toDate();

    return new TokenModel(
      payload.accountId,
      accessToken,
      refreshToken,
      accessExpireDate,
      refreshExpireDate,
    );
  }

  async requestResetPasswordOtp(email: string): Promise<void> {
    const account = await this.accountService.checkExistEmail(email);
    if (!account) {
      throw new UnauthorizedException('Email does not exist');
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, SALT_OR_ROUNDS);

    const expiresAt = new Date(Date.now() + ms('5m'));

    const otpRecord = this.otpRepository.create({
      accountId: account?.id,
      email,
      otpCode: hashedOtp,
      createdAt: new Date(),
      expiresAt,
      isUse: false,
    });

    await this.otpRepository.save(otpRecord);

    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset OTP',
      html: `Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.`,
    });
  }

  async resetPassword(
    email: string,
    otp: string,
    newPassword: string,
  ): Promise<void> {
    const otpRecord = await this.otpRepository.findOne({
      where: {
        email,
        isUse: false,
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const isValid = await bcrypt.compare(otp, otpRecord.otpCode);
    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.accountService.updateAccount(
      await this.accountService.getAccount(otpRecord.accountId),
      undefined,
      hashedPassword,
      undefined,
      undefined,
    );

    otpRecord.isUse = true;
    await this.otpRepository.save(otpRecord);

    await this.otpRepository.delete({
      email,
      id: Not(otpRecord.id),
    });
  }
}
