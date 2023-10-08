import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import mailConfig from './mail.config';

@Injectable()
export class MailService {
  private transporter = createTransport({
    host: mailConfig.smtpHost,
    port: mailConfig.smtpPort,
    auth: {
      user: mailConfig.email,
      pass: mailConfig.password,
    },
  });

  async sendEmail(to: string, subject: string, message: string) {
    await this.transporter.sendMail({
      from: mailConfig.email,
      to,
      subject,
      text: message,
    });
  }
}
