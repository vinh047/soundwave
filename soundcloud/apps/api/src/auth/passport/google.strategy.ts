import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${configService.get('API_URL')}/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  /**
   * Hàm này sẽ chạy SAU KHI Google xác thực thành công
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { name, emails, photos } = profile;
      const email = emails[0].value;
      const profileImage = photos && photos.length > 0 ? photos[0].value : null;

      const user = await this.authService.validateGoogleUser({
        email: email,
        name: name.givenName || 'User',
        image: profileImage,
      });

      // Gửi user đi tiếp cho Guard (để vào req.user)
      done(null, user);
    } catch (error) {
      if (error instanceof ConflictException) {
        done(null, { error: error.message });
      } else {
        done(error, null);
      }
    }
  }
}
