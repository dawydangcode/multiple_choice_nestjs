import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private requests = new Map<string, RateLimitInfo>();

  // Cấu hình rate limiting
  private readonly windowMs = 15 * 60 * 1000; // 15 phút
  private readonly maxRequests = 100; // Tối đa 100 requests trong 15 phút
  private readonly blockDurationMs = 5 * 60 * 1000; // Block 5 phút nếu vượt quá

  use(req: Request, res: Response, next: NextFunction) {
    const clientId = this.getClientId(req);
    const now = Date.now();

    // Lấy thông tin rate limit của client
    let rateLimitInfo = this.requests.get(clientId);

    // Nếu không có thông tin hoặc đã hết window time
    if (!rateLimitInfo || now > rateLimitInfo.resetTime) {
      rateLimitInfo = {
        count: 1,
        resetTime: now + this.windowMs,
      };
    } else {
      rateLimitInfo.count++;
    }

    // Cập nhật thông tin
    this.requests.set(clientId, rateLimitInfo);

    // Kiểm tra có vượt quá limit không
    if (rateLimitInfo.count > this.maxRequests) {
      // Set headers để client biết về rate limit
      res.set({
        'X-RateLimit-Limit': this.maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(rateLimitInfo.resetTime).toISOString(),
        'Retry-After': Math.ceil(
          (rateLimitInfo.resetTime - now) / 1000,
        ).toString(),
      });

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests. Please try again later.',
          error: 'Too Many Requests',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Set headers thông tin rate limit
    res.set({
      'X-RateLimit-Limit': this.maxRequests.toString(),
      'X-RateLimit-Remaining': (
        this.maxRequests - rateLimitInfo.count
      ).toString(),
      'X-RateLimit-Reset': new Date(rateLimitInfo.resetTime).toISOString(),
    });

    next();
  }

  private getClientId(req: Request): string {
    // Ưu tiên user ID nếu có authentication
    if (req.user && (req.user as any).id) {
      return `user:${(req.user as any).id}`;
    }

    // Fallback to IP address
    return `ip:${req.ip || req.socket.remoteAddress || 'unknown'}`;
  }

  // Method để clear rate limit data cũ (có thể chạy định kỳ)
  cleanup() {
    const now = Date.now();
    for (const [key, info] of this.requests.entries()) {
      if (now > info.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}
