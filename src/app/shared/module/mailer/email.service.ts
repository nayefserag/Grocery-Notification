import { Injectable } from '@nestjs/common';
import { EmailConfigService } from '../config-module/email-config.service';
import { ForgotPasswordDto } from 'src/app/module/application/user-emails/model/forget-password.dto';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';
import { config } from '../config-module/config.service';
import { CompleteUserDto } from 'src/app/module/application/user-emails/model/complete-user.dto';
// import { getForgotPasswordEmailTemplate } from './email-template.helper';
@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly emailConfigService: EmailConfigService) {
    this.transporter = this.emailConfigService.createTransporter();
  }

  async sendForgotPasswordEmail(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<void> {
    const resetPasswordUrl = `${config.getString('FRONTEND_URL')}/reset-password`;
    const filePath = path.resolve(
      __dirname,
      '../../templates/forgot-password.template.html',
    );
    let htmlContent = fs.readFileSync(filePath, 'utf-8');

    htmlContent = htmlContent.replace('{{resetPasswordUrl}}', resetPasswordUrl);

    const mailOptions = {
      from: 'expromentalprojects@gmail.com',
      to: forgotPasswordDto.email,
      subject: 'Reset Your Password',
      html: htmlContent,
    };

    return await this.transporter.sendMail(mailOptions);
  }

  async sendCompleteRegistrationEmail(body: CompleteUserDto): Promise<void> {
    console.log('body' ,body);
    const completeRegistrationUrl = `${config.getString('FRONTEND_URL')}/complete-registration/${body.id}`;
    const filePath = path.resolve(
      __dirname,
      '../../templates/complete-registration.template.html',
    );
    let htmlContent = fs.readFileSync(filePath, 'utf-8');

    htmlContent = htmlContent.replace(
      '{{completeRegistrationUrl}}',
      completeRegistrationUrl,
    );

    const mailOptions = {
      from: 'expromentalprojects@gmail.com',
      to: body.email,
      subject: 'Complete Your Registration',
      html: htmlContent,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
