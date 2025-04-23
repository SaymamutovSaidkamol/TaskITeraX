import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, ValidateNested } from 'class-validator';
import { OrderStatus } from 'src/Enums/enums';
import { Type } from 'class-transformer';

export class OrderItemUPdateDto {
  @ApiProperty({ example: 2 })
  @IsNumber()
  productId?: number;

  @IsNumber()
  orderId?: number;

  @ApiProperty({
    example: 2,
    description: 'Zakaz qilmoqchi bulgan orderlaringizni soni',
  })
  @IsNumber()
  quantity?: number;
}

export class UpdateOrderDto {
  @IsNumber()
  userId?: number;

  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemUPdateDto)
  @ApiProperty({
    type: [OrderItemUPdateDto],
  })
  OrderItem?: OrderItemUPdateDto[];
}
