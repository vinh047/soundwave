import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor() {
    super({
      // Tham số này ép buộc Google hiện màn hình chọn tài khoản
      prompt: 'select_account', 
    });
  }
}