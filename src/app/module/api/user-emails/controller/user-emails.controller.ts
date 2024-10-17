import { Body, Controller, Get, Post } from '@nestjs/common';
import { CompleteUserDto } from 'src/app/module/application/user-emails/model/complete-user.dto';
import { ForgotPasswordDto } from 'src/app/module/application/user-emails/model/forget-password.dto';
import { UserEmailsService } from 'src/app/module/application/user-emails/services/user-emails.service';

@Controller('user-emails')
export class UserEmailsController {
  constructor(private readonly userEmailsService: UserEmailsService) {}

  @Post('send-forgot-password-email')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.userEmailsService.forgotPassword(forgotPasswordDto);
  }

  @Post('send-complete-registration-email')
  async sendCompleteRegistrationEmail(@Body() body: CompleteUserDto) {
    return await this.userEmailsService.sendCompleteRegistrationEmail(body);
  }
}
