import { Module } from '@nestjs/common';
import { AuthRepository } from '../infrastructure/repositories/auth/auth.repository';
import { UserEmailsModule } from '../api/user-emails/user-emails.module';

@Module({
  imports: [UserEmailsModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class ApplicationModule {}
