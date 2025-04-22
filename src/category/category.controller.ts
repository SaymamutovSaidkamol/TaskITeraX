import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/Enums/enums';
import { RoleGuard } from 'src/auth/role.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetCategoryQueryDto } from './dto/query-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
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
   query(@Query() query: GetCategoryQueryDto, @Req() req: Request) {
     return this.categoryService.findAll(query);
   }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
