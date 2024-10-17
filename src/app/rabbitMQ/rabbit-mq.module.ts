import { Module } from "@nestjs/common";
import { RabbitMQPublisher } from "./rabbit-mq-publisher";

@Module({
    providers: [RabbitMQPublisher],
    exports: [RabbitMQPublisher],
    imports: [RabbitMQPublisher],
})
export class RabbitMQModule {}