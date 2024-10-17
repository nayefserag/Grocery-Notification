import { Module } from '@nestjs/common';
import { UserEmailsModule } from './app/module/api/user-emails/user-emails.module';

@Module({
  imports: [UserEmailsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
