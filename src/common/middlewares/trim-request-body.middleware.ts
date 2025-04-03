import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TrimRequestBodyMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    if (request.body) {
      Object.keys(request.body).forEach((key) => {
        if (typeof request.body[key] === 'string') {
          request.body[key] = request.body[key].trim();
        }
      });
    }
    next();
  }
}
