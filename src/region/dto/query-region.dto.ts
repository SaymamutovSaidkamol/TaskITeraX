import { IsOptional, IsNumberString, IsString, IsIn, IsEnum, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetRegionQueryDto {
  @ApiPropertyOptional({ description: 'name bo‘yicha qidiruv' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Sahifa raqami' })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: 'Har sahifada nechta element' })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({
      enum: ['name'],
      example: 'name',
    })
    @IsOptional()
    @IsEnum(['name'])
    sort?: string = 'name';
  
    @ApiPropertyOptional({ enum: ['asc', 'desc'], example: 'asc' })
    @IsOptional()
    @IsEnum(['asc', 'desc'])
    order?: 'asc' | 'desc' = 'desc';
}
