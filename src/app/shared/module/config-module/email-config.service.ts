import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { config } from './config.service';

@Injectable()
export class EmailConfigService {
  createTransporter(): nodemailer.Transporter {
    return nodemailer.createTransport({
      host: config.getString('EMAIL_HOST'), 
      port: config.getNumber('EMAIL_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.getString('EMAIL_USER'),
        pass: config.getString('EMAIL_PASSWORD'), 
      },
    });
  }
}
