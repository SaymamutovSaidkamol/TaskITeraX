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
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/Enums/enums';
import { Roles } from 'src/decorators/role.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetOrderQueryDto } from './dto/query-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Orderlarni yaratish"
  })
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    return this.orderService.create(createOrderDto, req);
  }

   
  @Roles(Role.ADMIN)
   @UseGuards(AuthGuard, RoleGuard)
   @Get('/query')
   @ApiOperation({
     summary: 'Categorylar qidirish',
     description:
       'Berilgan parametrlar bo‘yicha Categorylar filterlash, sortlash, pagination',
   })
   @ApiResponse({ status: 200, description: 'Muvaffaqiyatli bajarildi' })
   @ApiResponse({ status: 400, description: 'Noto‘g‘ri so‘rov' })
   query(@Query() query: GetOrderQueryDto, @Req() req: Request) {
     return this.orderService.findAll(query, req);
   }
   
   @UseGuards(AuthGuard)
   @ApiOperation({
     summary: "Orderlarni User ID bo'yicha qidirish"
   })
   @Get('my-order')
   findOneByUser(string, @Req() req: Request) {
     return this.orderService.findOneByUser(req);
   }
   
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Orderlarni ID bo'yicha qidirish"
  })
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.orderService.findOne(+id, req);
  }

  
}
