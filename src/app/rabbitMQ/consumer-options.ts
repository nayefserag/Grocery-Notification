export interface ConsumerOptions {
    url: string;
    routingKey?: string;
    prefetchCount?: number;
    queue :{
        name: string;
        options? : any;
    }
}