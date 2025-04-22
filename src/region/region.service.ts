import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Region } from 'src/entities/region-entities';
import { Repository } from 'typeorm';
import { Request } from 'express';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region) // Region uchun Repositoryni injektsiya qilish
    private region: Repository<Region>,
  ) {}
  async create(data: CreateRegionDto) {
    let checkRegion = await this.region.findOne({ where: { name: data.name } });

    if (!checkRegion) {
      throw new BadRequestException('This region alredy exist');
    }

    let newRegion = await this.region.create(data);
    await this.region.save(newRegion);
    return { data: newRegion };
  }

  findAll(req: Request) {
    console.log(req['user']);
    
    return `This action returns all region`;
  }

  findOne(id: number) {
    return `This action returns a #${id} region`;
  }

  update(id: number, updateRegionDto: UpdateRegionDto) {
    return `This action updates a #${id} region`;
  }

  remove(id: number) {
    return `This action removes a #${id} region`;
  }
}
