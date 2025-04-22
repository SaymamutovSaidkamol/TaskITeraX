import {
  IsOptional,
  IsNumberString,
  IsString,
  IsIn,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetProductQueryDto {
  @ApiPropertyOptional({ description: 'name bo‘yicha qidiruv' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Sahifa raqami' })
  @IsOptional()
  @IsNumberString()
  price?: string;

  @ApiPropertyOptional({ description: 'Sahifa raqami' })
  @IsOptional()
  @IsNumberString()
  stock?: string;

  @ApiPropertyOptional({ description: 'Sahifa raqami' })
  @IsOptional()
  @IsNumberString()
  category?: string;

  @ApiPropertyOptional({ description: 'Sahifa raqami' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ description: 'Har sahifada nechta element' })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({
    enum: ['name', 'price', 'stock'],
    example: 'name',
  })
  @IsOptional()
  @IsEnum(['name', 'price', 'stock'])
  sort?: string = 'name';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], example: 'asc' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}
