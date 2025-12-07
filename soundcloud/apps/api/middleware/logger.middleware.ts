// logger.middleware.ts
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    
    // LOG QUAN TRỌNG: In ra xem có Authorization header không
    const authHeader = req.headers['authorization'];
    
    this.logger.log(`Incoming Request: ${method} ${originalUrl}`);
    this.logger.debug(`Authorization Header: ${authHeader || 'NOT FOUND'}`);

    next();
  }
}