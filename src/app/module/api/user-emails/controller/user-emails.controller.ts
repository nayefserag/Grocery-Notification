import { Body, Controller, Post } from '@nestjs/common';
import { CompleteUserDto } from 'src/app/module/application/user-emails/model/complete-user.dto';
import { ForgotPasswordDto } from 'src/app/module/application/user-emails/model/forget-password.dto';
import { UserEmailsService } from 'src/app/module/application/user-emails/services/user-emails.service';

@Controller('user-emails')
export class UserEmailsController {
  constructor(private readonly userEmailsService: UserEmailsService) {}

  /**
   * Sends an email based on the type ('forgotPassword' or 'completeRegistration')
   * @param emailType - Type of the email ('forgotPassword' or 'completeRegistration')
   * @param dto - The DTO containing user details and email
   * @returns Success message if email sent successfully
   */
@Post('send-email')
async sendEmail(
  @Body('emailType') emailType: 'forgotPassword' | 'completeRegistration',
  @Body('dto') userEmailDto: ForgotPasswordDto | CompleteUserDto,
) {
  switch (emailType) {
    case 'forgotPassword':
      return this.userEmailsService.forgotPassword(userEmailDto as ForgotPasswordDto);
    case 'completeRegistration':
      return this.userEmailsService.sendCompleteRegistrationEmail(userEmailDto as CompleteUserDto);
    default:
      throw new Error('Invalid email type provided');
  }
}
}
