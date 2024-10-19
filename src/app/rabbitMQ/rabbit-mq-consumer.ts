import { Injectable, Logger } from '@nestjs/common';
import { ServerRMQ } from '@nestjs/microservices';
import { RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT } from '@nestjs/microservices/constants';
import { Channel, Message } from 'amqplib';
import { ConsumerOptions } from './consumer-options';
import { UserEmailsService } from '../module/application/user-emails/services/user-emails.service';
@Injectable()
export class RabbitMQConsumer extends ServerRMQ {
  readonly logger = new Logger(RabbitMQConsumer.name);

  constructor(
    protected readonly consumerOptions: ConsumerOptions,
    private readonly userEmailsService: UserEmailsService,
  ) {
    super({
      urls: [consumerOptions.url],
      prefetchCount: consumerOptions.prefetchCount,
      queue: consumerOptions.queue.name,
      queueOptions: consumerOptions.queue.options,
    });
    this.logger.log('RabbitMQConsumer initialized.');
  }

  async setupChannel(channel: Channel): Promise<any> {
    try {
      const queue = this.getOptionsProp(this.consumerOptions, 'queue');
      const prefetchCount = this.getOptionsProp(
        this.consumerOptions,
        'prefetchCount',
      );

      this.logger.log(`Asserting queue: ${queue.name}`);
      await channel.assertQueue(queue.name, queue.options);

      this.logger.debug(`Setting prefetch count: ${prefetchCount}`);
      await channel.prefetch(
        prefetchCount,
        RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT,
      );

      this.logger.log(`Consuming messages from queue: ${queue.name}`);
      await channel.consume(
        queue.name,
        (message: Message) => this.handleMessage(message, channel),
        { noAck: false },
      );
    } catch (e) {
      this.logger.error(`Error setting up channel: ${e.message}`, e.stack);
      throw e;
    }
  }

  async handleMessage(message: Message, channel: Channel): Promise<any> {
    try {
      const content = JSON.parse(message.content.toString()); // Parse the message content
      this.logger.log(`Received message: ${JSON.stringify(content)}`);
      await this.userEmailsService.sendOtpVerificationEmail(content);

      channel.ack(message);
      this.logger.log('Message processed and acknowledged successfully.');
    } catch (e) {
      this.logger.error(
        `Error handling message: ${e.message} - Message not acknowledged, requeueing.`,
        e.stack,
      );
      channel.nack(message, false, true); 
    }
  }
}
