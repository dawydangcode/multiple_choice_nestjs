import { Request } from 'express';

export function throwError(message = ''): never {
  throw new Error(message);
}
export function extractTokenFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
