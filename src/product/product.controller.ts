import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetProductQueryDto } from './dto/query-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

   // @UseGuards(AuthGuard)
   @Get('/query')
   @ApiOperation({
     summary: 'Categorylar qidirish',
     description:
       'Berilgan parametrlar bo‘yicha Categorylar filterlash, sortlash, pagination',
   })
   @ApiResponse({ status: 200, description: 'Muvaffaqiyatli bajarildi' })
   @ApiResponse({ status: 400, description: 'Noto‘g‘ri so‘rov' })
   query(@Query() query: GetProductQueryDto, @Req() req: Request) {
     return this.productService.findAll(query);
   }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
