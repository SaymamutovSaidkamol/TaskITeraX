import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Role, UserStatus } from 'src/Enums/enums';

export class CreateUserDto {
  @ApiProperty({
    example: 'Saidkamol',
    description: 'Foydalanuvchining ismi',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Kamolov',
    description: 'Foydalanuvchining familiyasi',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'cryptouchun06@gmail.com',
    description: 'Foydalanuvchining emaili',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+998943861006',
    description: 'Foydalanuvchining telefon raqami',
    required: true,
  })
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({
    example: '1234',
    description: 'Foydalanuvchining paroli',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'saidkamol.jpg',
    description: 'Foydalanuvchining rasmi',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  img: string;

  @ApiProperty({
    example: Role.USER,
    description: 'Foydalanuvchi roli',
    required: true,
  })
  @IsEnum(Role)
  role: Role;

  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiProperty({ example: 1, description: 'Region ID', required: true })
  @IsNumber()
  region: number;
}

export class VerifyAccount {
  @ApiProperty({
    example: '+998943861006',
    description: 'Foydalanuvchining telefon raqami',
    required: true,
  })
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({ example: 2334, description: 'OTP Code', required: true })
  otp: string;
}

export class Sendotp {
  @ApiProperty({
    example: '+998943861006',
    description: 'Foydalanuvchining telefon raqami',
    required: true,
  })
  @IsPhoneNumber('UZ')
  phone: string;
}

export class LoginDto {
  @ApiProperty({
    example: '+998943861006',
    description: 'Foydalanuvchining telefon raqami',
    required: true,
  })
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({
    example: '1234',
    description: 'Foydalanuvchining passwordi',
    required: true,
  })
  @IsPhoneNumber('UZ')
  password: string;
}

export class sendOtpDto {
  @ApiProperty({
    example: '+998943861006',
    description: 'Foydalanuvchining telefon raqami',
    required: true,
  })
  @IsPhoneNumber('UZ')
  phone: string;
}

export class resetPasswordDto {
  @ApiProperty({
    example: '+998943861006',
    description: 'Foydalanuvchining telefon raqami',
    required: true,
  })
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({
    example: '1234',
    description: 'Foydalanuvchining passwordi',
    required: true,
  })
  @IsPhoneNumber('UZ')
  password: string;

  @ApiProperty({ example: 2334, description: 'OTP Code', required: true })
  otp: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'refresh_token' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export function isValidUzbekPhoneNumber(phoneNumber: string): boolean {
  // Bo‘sh joylar va tirelarni olib tashlaymiz
  const cleaned = phoneNumber.replace(/[\s\-]/g, '');

  // Regex pattern
  const regex = /^\+998(33|88|9[0-5|7-9])\d{7}$/;

  return regex.test(cleaned);
}


export class addAdminDto {
  @ApiProperty({
    example: 'Saidkamol',
    description: 'Foydalanuvchining ismi',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Kamolov',
    description: 'Foydalanuvchining familiyasi',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'cryptouchun06@gmail.com',
    description: 'Foydalanuvchining emaili',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+998943861006',
    description: 'Foydalanuvchining telefon raqami',
    required: true,
  })
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({
    example: '1234',
    description: 'Foydalanuvchining paroli',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'saidkamol.jpg',
    description: 'Foydalanuvchining rasmi',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  img: string;

  @ApiProperty({
    example: Role.ADMIN,
    description: 'Foydalanuvchi roli',
    required: true,
  })
  @IsEnum(Role)
  role: Role;

  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiProperty({ example: 1, description: 'Region ID', required: true })
  @IsNumber()
  region: number;
}


export function StrongPassword(password: string): boolean {
  const minLength = /.{6,}/;
  const hasUpperCase = /[A-Z]/;
  const hasLowerCase = /[a-z]/;
  const hasDigit = /[0-9]/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

  return (
    minLength.test(password) &&
    hasUpperCase.test(password) &&
    hasLowerCase.test(password) &&
    hasDigit.test(password) &&
    hasSpecialChar.test(password)
  );
}
