import { Module } from '@nestjs/common';
import { UserEmailsModule } from './user-emails/user-emails.module';
import { AuthRepository } from '../infrastructure/repositories/auth/auth.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [UserEmailsModule, AuthRepository],
  exports: [],
})
export class ApiModule {}
