import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { throwError } from 'src/utils/function';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    return this.configService.get<string>('app.name') ?? throwError();
  }
}
