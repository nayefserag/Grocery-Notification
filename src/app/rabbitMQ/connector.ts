import * as querystring from 'querystring';

import { config } from 'src/app/shared/module/config-module/config.service';

export class Connector {
  public static getConnectionUrl(): string {
    const hostname = config.getString('RABBITMQ_1_HOST');
    const port = config.getNumber('RABBITMQ_1_PORT');
    const username = config.getString('RABBITMQ_1_USER_NAME');
    const password = config.getString('RABBITMQ_1_PASSWORD');
    const vhost = config.getString('RABBITMQ_1_VHOST');
    const options = querystring.stringify({
      heartbeat: config.getNumber('RABBITMQ_1_HEART_BEAT'),
    });
    const credentials = `${username}:${password}`;
    const amqpAuthority = `${credentials}@${hostname}:${port}`;
    const amqpURI = `amqp://${amqpAuthority}/${vhost}?${options}`;
    return encodeURI(amqpURI);
  }
}
