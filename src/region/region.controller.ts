import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/Enums/enums';
import { RoleGuard } from 'src/auth/role.guard';
import { Request } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetRegionQueryDto } from './dto/query-region.dto';

@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOperation({
    summary: "Regionlar yaratish, 'ADMIN'"
  })
  @Post()
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionService.create(createRegionDto);
  }


  @UseGuards(AuthGuard)
     @Get('/query')
     @ApiOperation({
       summary: 'Regionlarni qidirish',
       description:
         'Berilgan parametrlar bo‘yicha Regionlarni filterlash, sortlash, pagination',
     })
     @ApiResponse({ status: 200, description: 'Muvaffaqiyatli bajarildi' })
     @ApiResponse({ status: 400, description: 'Noto‘g‘ri so‘rov' })
     query(@Query() query: GetRegionQueryDto, @Req() req: Request) {
       return this.regionService.findAll(query);
     }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Regionlar ID bo'yicha qidirish"
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regionService.findOne(+id);
  }
  
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOperation({
    summary: "Regionlar ID bo'yocha o'zgartirish, 'ADMIN'"
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionService.update(+id, updateRegionDto);
  }
  
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOperation({
    summary: "Regionlar ID bo'yicha o'chirish, 'ADMIN'"
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regionService.remove(+id);
  }
}
