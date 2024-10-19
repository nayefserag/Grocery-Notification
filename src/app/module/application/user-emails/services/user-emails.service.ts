import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ForgotPasswordDto } from '../model/forget-password.dto';
import { EmailService } from '../../../../shared/module/mailer/email.service';
import { CompleteUserDto } from '../model/complete-user.dto';
import { OtpVerificationDto } from '../model/otp-verification.dto';

@Injectable()
export class UserEmailsService {
  private readonly logger = new Logger(UserEmailsService.name);

  constructor(private readonly mailerService: EmailService) {}
  private async sendEmail(
    emailType: 'forgotPassword' | 'completeRegistration' | 'otpVerification',
    dto: ForgotPasswordDto | CompleteUserDto | OtpVerificationDto,
    dynamicValue?: string,
  ) {
    try {
      await this.mailerService.sendTemplateEmail(
        dto.email,
        emailType === 'forgotPassword'
          ? 'Reset Your Password'
          : emailType === 'completeRegistration'
            ? 'Complete Your Registration'
            : 'Verify Your Email with OTP',
        emailType,
        dynamicValue || '',
      );

      this.logger.log(`${emailType} email sent to ${dto.email}`);

      return {
        message: `${
          emailType === 'forgotPassword'
            ? 'Password reset link'
            : emailType === 'completeRegistration'
              ? 'Registration completion email'
              : 'OTP verification email'
        } has been sent to ${dto.email}`,
      };
    } catch (error) {
      this.logger.error(
        `Failed to send ${emailType} email to ${dto.email}`,
        error.stack,
      );
      throw new BadRequestException(
        `Unable to send ${
          emailType === 'forgotPassword'
            ? 'password reset'
            : emailType === 'completeRegistration'
              ? 'registration'
              : 'OTP verification'
        } email. Please try again later.`,
      );
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    return this.sendEmail('forgotPassword', forgotPasswordDto);
  }

  async sendCompleteRegistrationEmail(completeUserDto: CompleteUserDto) {
    return this.sendEmail(
      'completeRegistration',
      completeUserDto,
      completeUserDto.id,
    );
  }

  async sendOtpVerificationEmail(otpVerificationDto: OtpVerificationDto) {
    return this.sendEmail(
      'otpVerification',
      otpVerificationDto,
      otpVerificationDto.otp,
    );
  }
}
