import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, ValidateNested } from 'class-validator';
import { OrderStatus } from 'src/Enums/enums';

export class OrderItemDto {
  @ApiProperty({ example: 2 })
  @IsNumber()
  productId: number;

  @IsNumber()
  orderId: number;

  @ApiProperty({
    example: 2,
    description: 'Zakaz qilmoqchi bulgan orderlaringizni soni',
  })
  @IsNumber()
  quantity?: number;
}

export class CreateOrderDto {
  @IsNumber()
  userId: number;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @ApiProperty({
    type: [OrderItemDto],
  })
  OrderItem: OrderItemDto[];
}
