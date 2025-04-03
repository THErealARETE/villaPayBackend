import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getClientIp } from 'request-ip';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(HttpLoggerMiddleware.name);
  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const clientIp = getClientIp(request);
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${clientIp}`,
        'HTTPRequest',
      );
    });
    next();
  }
}
