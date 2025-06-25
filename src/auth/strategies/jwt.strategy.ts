import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { SessionService } from '../modules/session/session.service';
import { PayloadModel } from '../model/payload.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt.accessToken.secret')!,
    });
  }

  async validate(payload: PayloadModel): Promise<PayloadModel> {
    const session = await this.sessionService.getSessionById(
      payload.sessionId,
      true,
    );
    if (!session) {
      throw new UnauthorizedException('Invalid session');
    }
    console.log('JWT Payload:', payload);
    return payload;
  }
}
