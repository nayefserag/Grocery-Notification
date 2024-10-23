import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType, Logger } from '@nestjs/common';
import { config } from './app/shared/module/config-module/config.service';
import { RabbitMQConsumer } from './app/rabbitMQ/rabbit-mq-consumer';
import { Connector } from './app/rabbitMQ/connector';
import { UserEmailsService } from './app/module/application/user-emails/services/user-emails.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const connectionUrl = Connector.getConnectionUrl();
  Logger.log(`Connecting to RabbitMQ with URL: ${connectionUrl}`);
  const queueName = config.getString('EMAIL_VERIFICATION_QUEUE');
  Logger.log(`Listening on RabbitMQ queue: ${queueName}`);

  app.connectMicroservice({
    strategy: new RabbitMQConsumer(
      {
        url: Connector.getConnectionUrl(),
        prefetchCount: config.getNumber('RABBITMQ_PREFETCH_COUNT'),
        queue: {
          name: config.getString('EMAIL_VERIFICATION_QUEUE'),
        },
      },
      app.get(UserEmailsService),
    ),
  });
  app.connectMicroservice({
    strategy: new RabbitMQConsumer(
      {
        url: Connector.getConnectionUrl(),
        prefetchCount: config.getNumber('RABBITMQ_PREFETCH_COUNT'),
        queue: {
          name: config.getString('ORDER_QUEUE'),
        },
      },
      app.get(UserEmailsService),
    ),
  });
  await app.startAllMicroservices();
  await app.listen(config.getNumber('PORT'));
  Logger.log(`🚀 Notifications Service is running on: ${await app.getUrl()}`);
}
bootstrap();
