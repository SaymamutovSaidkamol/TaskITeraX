import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateProductDto {

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
        example: 50000,
        description: 'Product narxi',
        required: true,
      })
      @IsNumber()
      price?: number;
    
      @ApiProperty({
        example: 100000,
        description: 'Product Skidkasi',
        required: true,
      })
      @IsNumber()
      stock?: number;
    
      @ApiProperty({
        example: 'tv.jpg',
        description: 'TV ning rasmi',
        required: true,
      })
      @IsString()
      img?: string;
}
