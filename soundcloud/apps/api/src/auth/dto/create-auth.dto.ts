import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail({}, { message: 'Định dạng email không hợp lệ.' })
  @IsNotEmpty({ message: 'Email là bắt buộc.' })
  email!: string;

  @IsNotEmpty({ message: 'Mật khẩu là bắt buộc.' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
  password!: string;

  @IsOptional()
  name?: string;
}
