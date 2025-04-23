import { IsOptional, IsNumberString, IsEnum, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from 'src/Enums/enums';

export class GetOrderQueryDto {
  @ApiPropertyOptional({ description: 'User Id boyicha qidirish' })
  @IsOptional()
  @IsNumber()
  user?: number;

  @ApiPropertyOptional({
    enum: [OrderStatus.PENDING, OrderStatus.ACCEPTED],
    description: 'Buyurtma statusi',
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({ description: 'Sahifa raqami' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ description: 'Har sahifada nechta element' })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({
    enum: ['user', 'status'],
    description: 'Sort qilish ustuni',
    example: 'user',
  })
  @IsOptional()
  @IsEnum(['user', 'status'], {
    message: 'sort faqat "name" yoki "status" bo‘lishi mumkin',
  })
  sort?: 'user' | 'status' = 'user';

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    description: 'Sort tartibi',
    example: 'asc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}
