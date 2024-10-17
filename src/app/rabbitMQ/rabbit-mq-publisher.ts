import { ClientRMQ } from '@nestjs/microservices';
import { Channel, Options } from 'amqplib';
import { Connector } from './connector';
import { QueueDefinition } from './queue.difinition';
import { ExchangeDefinition } from './exchange.definition';

export class RabbitMQPublisher extends ClientRMQ {
  protected confirmedChannel: Channel;
  constructor() {
    super({ urls: [Connector.getConnectionUrl()] });
  }
  async createChannel(): Promise<void> {
    if (this.channel) {
      return;
    }
    await super.createChannel();
    this.confirmedChannel = this.channel._channel;
  }

  async publishToQueue(
    message: any,
    queue: QueueDefinition,
    options?: Options.Publish,
  ): Promise<any> {
    try {
      await this.connect();
      await this.createChannel();
      await this.channel.assertQueue(queue.name, queue.options);
      return this.channel.sendToQueue(
        queue.name,
        Buffer.from(JSON.stringify(message)),
        options,
      );
    } catch (error) {
      this.logger.error(
        `Failed to publish to queue with reason ${JSON.stringify(error)}`,
      );
    }
  }

  async publishToExchange(
    message: any,
    exchange: ExchangeDefinition,
    routingKey?: string,
    options?: Options.Publish,
  ): Promise<any> {
    await this.connect();
    await this.createChannel();
    await this.channel.assertExchange(
      exchange.name,
      exchange.type,
      exchange.options,
    );

    return this.channel.publish(
      exchange.name,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      options,
    );
  }
}
