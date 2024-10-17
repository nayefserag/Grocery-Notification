import { applyDecorators, UseFilters, UseInterceptors } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
export function QueueConsumer(queueName: string):any {
    return applyDecorators(
        MessagePattern(queueName),
        UseFilters(),
        UseInterceptors(),
    )
}