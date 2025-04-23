import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  addAdminDto,
  CreateUserDto,
  LoginDto,
  RefreshTokenDto,
  resetPasswordDto,
  Sendotp,
  sendOtpDto,
  VerifyAccount,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiProperty, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { QueryUserDto } from './dto/query-user.dto';
import { Role, UserStatus } from 'src/Enums/enums';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(AuthGuard)
  @Get('/query')
  @ApiOperation({
    summary: 'Userlarni qidirish',
    description:
      'Berilgan parametrlar bo‘yicha userlarni filterlash, sortlash, pagination',
  })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli bajarildi' })
  @ApiResponse({ status: 400, description: 'Noto‘g‘ri so‘rov' })
  query(@Query() query: QueryUserDto, @Req() req: Request) {
    return this.usersService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "User o'zini malumotini ko'rish"
  })
  @Get('me')
  Me(@Req() req: Request) {
    return this.usersService.me(req);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "User o'zini sessionini ko'rish"
  })
  @Get('my-session')
  MySession(@Req() req: Request) {
    return this.usersService.MySession(req);
  }

  @Post('register')
  @ApiOperation({
    summary: "User registratsiyadan o'tish"
  })
  Register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Post('send-otp')
  @ApiOperation({
    summary: "User acountini activate qlishi uchun numerga otp junatish"
  })
  SendOtp(@Body() createUserDto: Sendotp) {
    return this.usersService.sendOtp(createUserDto);
  }

  @Post('verify-account')
  @ApiOperation({
    summary: "User acountini active qlish"
  })
  VerifyAccount(@Body() createUserDto: VerifyAccount) {
    return this.usersService.VerifyAccount(createUserDto);
  }

  @Post('login')
  @ApiOperation({
    summary: "User login qlish"
  })
  Login(@Body() createUserDto: LoginDto, @Req() req: Request) {
    return this.usersService.login(createUserDto, req);
  }


  @Post('refresh-token')
  @ApiOperation({
    summary: "User refresh token orqalik access token olish"
  })
  refreshToken(@Body() data: RefreshTokenDto, @Req() req: Request) {
    return this.usersService.refreshToken(data);
  }

  @Post('/resetPassword/send-Otp')
  @ApiOperation({
    summary: "User password update qlish uchun numerga opt junatish"
  })
  sendOtp(@Body() data: sendOtpDto, @Req() req: Request) {
    return this.usersService.sendotpPassword(data);
  }

  @Post('/reset-password')
  @ApiOperation({
    summary: "User password update qlish"
  })
  resetPassword(@Body() data: resetPasswordDto) {
    return this.usersService.resetPassword(data);
  }

  @UseGuards(AuthGuard)
  @Post('/add-admin')
  @ApiOperation({
    summary: "Admin Admin qo'shish"
  })
  addAdmin(@Body() data: addAdminDto, @Req() req: Request) {
    return this.usersService.addAdmin(data, req);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "User o'zini malumotini o'zgartirish"
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    return this.usersService.update(+id, updateUserDto, req);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "User o'zini o'chirish"
  })
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.usersService.remove(+id, req);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
