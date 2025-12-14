import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) { }

  async sendVerificationEmail(
    email: string,
    name: string,
    verificationLink: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Xác thực tài khoản',
      template: './verification',
      context: {
        name,
        verificationLink,
      },
    });
  }

  async sendWarning(email: string, trackTitle: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Cảnh báo vi phạm bản quyền',
      template: './warning',
      context: {
        trackTitle,
      },
    });
  }
}
