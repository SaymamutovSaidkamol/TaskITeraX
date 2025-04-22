import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    example: 'TV',
    description: 'Televizorlar brandi',
    required: true,
  })
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Samsung televizor SmartTv',
    description: 'Tv ning descriptioni',
    required: true,
  })
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'tv.jpg',
    description: 'TV ning rasmi',
    required: true,
  })
  @IsString()
  img?: string;
}
