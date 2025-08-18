import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

export interface ThrottleConfig {
  limit: number; // Số request tối đa
  ttl: number; // Thời gian window (milliseconds)
}

// Decorator để cấu hình throttle cho endpoint
export const THROTTLE_KEY = 'throttle';
export const Throttle = (limit: number, ttl: number) =>
  SetMetadata(THROTTLE_KEY, { limit, ttl });

@Injectable()
export class ThrottleGuard implements CanActivate {
  private requests = new Map<string, number[]>();

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const handler = context.getHandler();
    const classRef = context.getClass();

    // Lấy cấu hình throttle từ decorator
    const throttleConfig =
      this.reflector.get<ThrottleConfig>(THROTTLE_KEY, handler) ||
      this.reflector.get<ThrottleConfig>(THROTTLE_KEY, classRef);

    if (!throttleConfig) {
      return true; // Không có throttle config thì cho phép
    }

    const { limit, ttl } = throttleConfig;
    const clientId = this.getClientId(request);
    const now = Date.now();

    // Lấy danh sách request times của client
    let requestTimes = this.requests.get(clientId) || [];

    // Loại bỏ các request cũ ngoài window
    requestTimes = requestTimes.filter((time) => now - time < ttl);

    // Kiểm tra có vượt quá limit không
    if (requestTimes.length >= limit) {
      const oldestRequest = Math.min(...requestTimes);
      const resetTime = oldestRequest + ttl;

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Rate limit exceeded. Try again in ${Math.ceil((resetTime - now) / 1000)} seconds.`,
          error: 'Too Many Requests',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Thêm request hiện tại
    requestTimes.push(now);
    this.requests.set(clientId, requestTimes);

    return true;
  }

  private getClientId(request: Request): string {
    // Ưu tiên user ID nếu có authentication
    if (request.user && (request.user as any).id) {
      return `user:${(request.user as any).id}`;
    }

    // Fallback to IP + endpoint
    const endpoint = `${request.method}:${request.path}`;
    return `ip:${request.ip || 'unknown'}:${endpoint}`;
  }

  // Cleanup old entries
  cleanup() {
    const now = Date.now();
    for (const [key, times] of this.requests.entries()) {
      const validTimes = times.filter(
        (time) => now - time < 24 * 60 * 60 * 1000,
      ); // Keep 24h
      if (validTimes.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validTimes);
      }
    }
  }
}
