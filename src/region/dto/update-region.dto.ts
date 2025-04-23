import { PartialType } from '@nestjs/mapped-types';
import { CreateRegionDto } from './create-region.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateRegionDto{
      @ApiProperty({
        example: 'Toshkent',
        description: 'Regionning nomi',
        required: true,
      })
      @IsString()
      name?: string;
}
