import { Injectable } from '@nestjs/common';
import { ServerRMQ } from '@nestjs/microservices';
import { RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT } from '@nestjs/microservices/constants';
import { Channel, Message } from 'amqplib';
import { ConsumerOptions } from './consumer-options';
// import { NotificationCommunicator } from '../module/infrastructure/communicator/notification.communicator';
import { config } from '../shared/module/config-module/config.service';
@Injectable()
export class RabbitMQConsumer extends ServerRMQ {
  constructor(
    protected readonly consumerOptions: ConsumerOptions,
    // private readonly notificationCommunicator: NotificationCommunicator,
  ) {
    super({
      urls: [consumerOptions.url],
      prefetchCount: consumerOptions.prefetchCount,
      queue: consumerOptions.queue.name,
      queueOptions: consumerOptions.queue.options,
    });
  }

  async setupChannel(channel: Channel): Promise<any> {
    try {
      const queue = this.getOptionsProp(this.consumerOptions, 'queue');
      const prefetchCount = this.getOptionsProp(
        this.consumerOptions,
        'prefetchCount',
      );

      await channel.assertQueue(queue.name, queue.options);
      await channel.prefetch(
        prefetchCount,
        RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT,
      );
      await channel.consume(
        queue.name,
        (message: Message) => this.handleMessage(message, channel),
        { noAck: false },
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  async handleMessage(message: Message, channel: Channel): Promise<any> {
    try {
      const queuename = this.consumerOptions.queue.name;
      const cancelQueueName = config.getString(
        'NOTIFICATION_FORGET_PASSWORD_EMAIL_QUEUE',
      );
      const skip = queuename == cancelQueueName;
      const content = JSON.parse(message.content.toString('utf-8'));
      this.logger.log(
        `Message Consumed from ${
          this.consumerOptions.queue.name
        }, Body: ${message.content.toString()}`,
        RabbitMQConsumer.name,
      );
      const { booking_id } = content;
      this.logger.log(
        `Processing booking ID: ${booking_id}`,
        RabbitMQConsumer.name,
      );

      channel.ack(message);

      return;
    } catch (e) {
      this.logger.error(
        `Error handling message: ${e.message} with stack not acked and requeued`,
        RabbitMQConsumer.name,
      ); // channel.nack(message, false, true);
      // Optionally, can requeueing for above line
    }
  }
}
