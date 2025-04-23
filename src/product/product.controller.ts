import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetProductQueryDto } from './dto/query-product.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from 'src/Enums/enums';
import { Roles } from 'src/decorators/role.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  @ApiOperation({
    summary: "Productlar yaratish, 'ADMIN'"
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

   @UseGuards(AuthGuard)
   @Get('/query')
   @ApiOperation({
     summary: 'Productlarni qidirish',
     description:
       'Berilgan parametrlar bo‘yicha Productlarni filterlash, sortlash, pagination',
   })
   @ApiResponse({ status: 200, description: 'Muvaffaqiyatli bajarildi' })
   @ApiResponse({ status: 400, description: 'Noto‘g‘ri so‘rov' })
   query(@Query() query: GetProductQueryDto, @Req() req: Request) {
     return this.productService.findAll(query);
   }

   @UseGuards(AuthGuard)
   @ApiOperation({
    summary: "Productlar ID bo'yicha qidirish"
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }


  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOperation({
    summary: "Productlar ID bo'yicha o'zgartirish, 'ADMIN'"
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }


  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOperation({
    summary: "Productlar ID bo'yicha o'chirish, 'ADMIN'"
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
