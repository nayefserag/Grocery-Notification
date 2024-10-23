import {
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsString,
  IsMongoId,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
export enum OrderStatus {
  pending = 'pending',
  completed = 'completed',
  shipped = 'shipped',
} // Order status enum
export class CreateOrderDto {
  @IsNotEmpty()
  @IsMongoId() // Ensures the ID is a valid MongoDB ObjectId
  id: string; // ID of the customer

  @IsArray()
  @ArrayMinSize(1) // Ensure that at least one item is present
  @IsNotEmpty({ each: true })
  @Type(() => OrderItemDto) // Apply transformation to each item in the array
  items: OrderItemDto[]; // Array of item IDs and quantities

  @IsNotEmpty()
  @IsNumber()
  totalPrice: number; // Total price of the order

  @IsString()
  status: OrderStatus = OrderStatus.pending; // Default order status

  @IsNotEmpty()
  @IsString()
  email: string;
}

export class OrderItemDto {
  @IsNotEmpty()
  @IsMongoId() // Ensures the itemId is a valid MongoDB ObjectId
  itemId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number; // Quantity of the item
}
