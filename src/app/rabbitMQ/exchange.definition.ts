export class ExchangeDefinition {
  name: string;
  type: string;
  options?: {
    durable?: boolean;
    internal?: boolean;
    autoDelete?: boolean;
    alternateExchange?: string;
    arguments?: any;
  };
}
