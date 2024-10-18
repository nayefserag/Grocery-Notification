import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ForgotPasswordDto } from '../model/forget-password.dto';
import { EmailService } from '../../../../shared/module/mailer/email.service';
import { CompleteUserDto } from '../model/complete-user.dto';

@Injectable()
export class UserEmailsService {
  private readonly logger = new Logger(UserEmailsService.name);

  constructor(private readonly mailerService: EmailService) {}
  private async sendEmail(
    emailType: 'forgotPassword' | 'completeRegistration',
    dto: ForgotPasswordDto | CompleteUserDto,
    dynamicValue?: string,
  ) {
    try {
      // Call the generic email sending method from EmailService
      await this.mailerService.sendTemplateEmail(
        dto.email,
        emailType === 'forgotPassword'
          ? 'Reset Your Password'
          : 'Complete Your Registration',
        emailType,
        dynamicValue || '',
      );

      this.logger.log(`${emailType} email sent to ${dto.email}`);

      return {
        message: `${emailType === 'forgotPassword' ? 'Password reset link' : 'Registration completion email'} has been sent to ${dto.email}`,
      };
    } catch (error) {
      this.logger.error(
        `Failed to send ${emailType} email to ${dto.email}`,
        error.stack,
      );
      throw new BadRequestException(
        `Unable to send ${emailType === 'forgotPassword' ? 'password reset' : 'registration'} email. Please try again later.`,
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
}
