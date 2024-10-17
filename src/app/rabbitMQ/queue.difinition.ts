export class QueueDefinition {
  name: string;
  options?: {
    durable?: true;
    autoDelete?: false;
    arguments?: {
      'x-message-ttl'?: number;
      'x-expires'?: number;
      'x-max-length'?: number;
      'x-max-length-bytes'?: number;
      'x-overflow'?: string;
      'x-dead-letter-exchange'?: string;
      'x-dead-letter-routing-key'?: string;
      'x-max-priority'?: number;
      'x-queue-mode'?: string;
      'x-queue-master-locator'?: string;
    };
  };
}
