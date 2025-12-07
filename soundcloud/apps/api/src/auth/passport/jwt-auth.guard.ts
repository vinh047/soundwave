import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/decorator/customize'; // Đảm bảo đường dẫn đúng

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  // 1. Luôn cho phép chạy qua để Passport thử giải mã Token
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // 2. Xử lý kết quả sau khi Passport chạy xong
  handleRequest(err, user, info, context: ExecutionContext) {
    // Check xem route hiện tại có phải Public không
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // TRƯỜNG HỢP 1: Có token hợp lệ -> Trả về user (req.user sẽ có dữ liệu)
    // Dù là route Public hay Private, miễn có token xịn là lấy user.
    if (user) {
      return user;
    }

    // TRƯỜNG HỢP 2: Không có token (hoặc token lỗi) NHƯNG là route Public
    // -> Cho phép đi qua, nhưng trả về null (req.user = null)
    if (isPublic) {
      return null;
    }

    // TRƯỜNG HỢP 3: Không có token VÀ là route Private
    // -> Báo lỗi 401 Unauthorized
    throw err || new UnauthorizedException("Token không hợp lệ hoặc không tồn tại");
  }
}