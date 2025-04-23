import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BasketService } from './basket.service';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { ApiOperation } from '@nestjs/swagger';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Basketga product qo'shish",
  })
  @Post()
  create(@Body() createBasketDto: CreateBasketDto, @Req() req: Request) {
    return this.basketService.create(createBasketDto, req);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "User Basketini ko'rish"
  })
  @Get('my-basket')
  findAll(@Req() req: Request) {
    return this.basketService.findAll(req);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "User Basketni ID bo'yicha o'zgartirish"
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBasketDto: UpdateBasketDto,
    @Req() req: Request,
  ) {
    return this.basketService.update(+id, updateBasketDto, req);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "User Basketni ID bo'yicha o'chirish"
  })
  @Delete('/clear')
  clear(@Req() req: Request) {
    return this.basketService.clear(req);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "User Basketni tozalash"
  })
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.basketService.remove(+id, req);
  }
}
