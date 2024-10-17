import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailConfigService {
  createTransporter(): nodemailer.Transporter {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',  // Use environment variables for security
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER || 'expromentalprojects@gmail.com', // Your email
        pass: process.env.EMAIL_PASSWORD || 'tgws xkrd zusg ieha', // Your password
      },
    });
  }
}
