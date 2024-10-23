import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ForgotPasswordDto } from '../model/forget-password.dto';
import { EmailService } from '../../../../shared/module/mailer/email.service';
import { CompleteUserDto } from '../model/complete-user.dto';
import { OtpVerificationDto } from '../model/otp-verification.dto';
import { CreateOrderDto } from '../model/order.dto';

@Injectable()
export class UserEmailsService {
  private readonly logger = new Logger(UserEmailsService.name);

  constructor(private readonly mailerService: EmailService) {}

  private async sendEmail(
    emailType: 'forgotPassword' | 'completeRegistration' | 'otpVerification' | 'orderDetails',
    dto: ForgotPasswordDto | CompleteUserDto | OtpVerificationDto | CreateOrderDto,
    dynamicValue: string = '',
  ) {
    let subject: string;

    switch (emailType) {
      case 'forgotPassword':
        subject = 'Reset Your Password';
        break;
      case 'completeRegistration':
        subject = 'Complete Your Registration';
        break;
      case 'otpVerification':
        subject = 'Verify Your Email with OTP';
        break;
      case 'orderDetails':
        subject = 'Your Order Details';
        break;
      default:
        throw new BadRequestException('Invalid email type');
    }

    try {
      await this.mailerService.sendTemplateEmail(
        dto.email,
        subject,
        emailType,
        dynamicValue,
      );

      this.logger.log(`${emailType} email sent to ${dto.email}`);

      return {
        message: `${subject} email has been sent to ${dto.email}`,
      };
    } catch (error) {
      this.logger.error(`Failed to send ${emailType} email to ${dto.email}`, error.stack);
      throw new BadRequestException(
        `Unable to send ${subject.toLowerCase()} email. Please try again later.`,
      );
    }
  }

  // Method for sending Forgot Password email
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    return this.sendEmail('forgotPassword', forgotPasswordDto);
  }

  // Method for sending Complete Registration email
  async sendCompleteRegistrationEmail(completeUserDto: CompleteUserDto) {
    return this.sendEmail('completeRegistration', completeUserDto, completeUserDto.id);
  }

  // Method for sending OTP Verification email
  async sendOtpVerificationEmail(otpVerificationDto: OtpVerificationDto) {
    return this.sendEmail('otpVerification', otpVerificationDto, otpVerificationDto.otp);
  }

  // Method for sending Order Details email
  async sendOrderDetailsEmail(orderDetailsDto: CreateOrderDto) {
    return this.sendEmail('orderDetails', orderDetailsDto, orderDetailsDto.id); // Assuming `orderId` is part of CreateOrderDto
  }
}
