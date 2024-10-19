import { Module } from '@nestjs/common';
import { RabbitMQPublisher } from './rabbit-mq-publisher';
import { UserEmailsService } from '../module/application/user-emails/services/user-emails.service';

@Module({
  providers: [RabbitMQPublisher, UserEmailsService],
  exports: [RabbitMQPublisher],
  imports: [RabbitMQPublisher],
})
export class RabbitMQModule {}
