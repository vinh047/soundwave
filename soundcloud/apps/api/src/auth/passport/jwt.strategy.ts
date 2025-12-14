import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

interface UserPayload {
  id: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Cách 1: Ưu tiên lấy từ Cookie
        (request: Request) => {
          let token = null;
          if (request && request.cookies) {
            token = request.cookies['access_token'];
            console.log('JwtStrategy Extracted Token:', token ? 'FOUND' : 'MISSING');
          }
          return token;
        },
        // Cách 2: (Tùy chọn) Vẫn giữ lại lấy từ Header để test Postman cho dễ
        // ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_SECRET')!,
    });
  }

  async validate(payload: any): Promise<UserPayload> {
    console.log('JwtStrategy Validate Payload:', payload);
    return { id: payload.sub, email: payload.email };
  }
}
