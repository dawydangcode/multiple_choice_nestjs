import { Request } from 'express';

export function throwError(message = ''): never {
  throw new Error(message);
}

export class ExpireTimeUtil {
  static parseExpireTimeForDateFns(expire: string): { [key: string]: number } {
    if (expire.endsWith('d')) {
      return { days: parseInt(expire) };
    }
    if (expire.endsWith('h')) {
      return { hours: parseInt(expire) };
    }
    if (expire.endsWith('m')) {
      return { minutes: parseInt(expire) };
    }
    if (expire.endsWith('s')) {
      return { seconds: parseInt(expire) };
    }
    return { seconds: parseInt(expire) };
  }
}

export function extractTokenFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
