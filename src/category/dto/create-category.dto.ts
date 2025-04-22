import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'TV',
    description: 'Televizorlar brandi',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Samsung televizor SmartTv',
    description: 'Tv ning descriptioni',
    required: true,
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'tv.jpg',
    description: 'TV ning rasmi',
    required: true,
  })
  @IsString()
  img: string;
}
