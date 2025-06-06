import { IsOptional, IsNumberString, IsString, IsIn, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetCategoryQueryDto {
  @ApiPropertyOptional({ description: 'name bo‘yicha qidiruv' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Sahifa raqami' })
  @IsOptional()
  @IsNumberString()
  page?: number;

  @ApiPropertyOptional({ description: 'Har sahifada nechta element' })
  @IsOptional()
  @IsNumberString()
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
