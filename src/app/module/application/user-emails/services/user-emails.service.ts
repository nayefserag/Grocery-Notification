import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import {
  comparePassword,
  hashPassword,
} from 'src/app/shared/utils/hash.helper';
import { ForgotPasswordDto } from '../model/forget-password.dto';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '../../../../shared/module/mailer/email.service';
import { TokenService } from 'src/app/module/strategies/jwt.service';
import { CompleteUserDto } from '../model/complete-user.dto';

// import { config } from 'src/app/shared/module/config-module/config-module.service';

@Injectable()
export class UserEmailsService {
  constructor(private readonly mailerService: EmailService) {
    let logger = new Logger();
    logger.log('UserEmailsService created', UserEmailsService.name);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    await this.mailerService.sendForgotPasswordEmail(forgotPasswordDto);
    return {
      message: `Password reset link has been sent to ${forgotPasswordDto.email}`,
    };
  }
  async sendCompleteRegistrationEmail(body:CompleteUserDto) {
    await this.mailerService.sendCompleteRegistrationEmail(body);
    return {
      message: `Email has been sent to ${body.email}`,
    };
  }
}
