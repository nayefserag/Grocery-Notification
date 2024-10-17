import { Module } from '@nestjs/common';
import { UserEmailsController } from './controller/user-emails.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../strategies/strategies';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import { TokenService } from '../../strategies/jwt.service';
import { UserEmailsService } from '../../application/user-emails/services/user-emails.service';
import { EmailService } from '../../../shared/module/mailer/email.service';
import { EmailConfigService } from 'src/app/shared/module/config-module/email-config.service';
@Module({
  imports: [JwtModule.register({}), InfrastructureModule],
  controllers: [UserEmailsController],
  providers: [
    UserEmailsService,
    EmailService,
    JwtStrategy,
    TokenService,
    EmailConfigService,
  ],
})
export class UserEmailsModule {}
