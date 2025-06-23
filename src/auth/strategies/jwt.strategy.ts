import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { SessionService } from '../modules/session/session.service';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private sessionService: SessionService,
    private accountService: AccountService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt.accessToken.secret')!,
    });
  }

  async validate(payload: any) {
    const session = await this.sessionService.getSessionById(
      payload.sessionId,
      true,
    );
    if (!session) {
      throw new UnauthorizedException('Invalid session');
    }
    return {
      accountId: payload.accountId,
      roleId: payload.roleId,
      sessionId: payload.sessionId,
    };
  }
}
