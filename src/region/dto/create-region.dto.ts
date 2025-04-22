import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRegionDto {
  @ApiProperty({
    example: 'Toshkent',
    description: 'Regionning nomi',
    required: true,
  })
  @IsString()
  name: string;
}
