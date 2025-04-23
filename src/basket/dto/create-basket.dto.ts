import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateBasketDto {
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  productId: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  quandtity: number;
}
