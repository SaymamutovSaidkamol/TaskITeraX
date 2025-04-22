import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'Saidkamol',
    description: 'Foydalanuvchining ismi',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @ApiProperty({
    example: 'Kamolov',
    description: 'Foydalanuvchining familiyasi',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @ApiProperty({
    example: 'cryptouchun06@gmail.com',
    description: 'Foydalanuvchining emaili',
    required: false,
  })
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'saidkamol.jpg',
    description: 'Foydalanuvchining Rasmi',
    required: false,
  })
  @IsEmail()
  img?: string;
}
