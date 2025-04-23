import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Region } from 'src/entities/region-entities';
import { ILike, Repository } from 'typeorm';
import { Request } from 'express';
import { GetRegionQueryDto } from './dto/query-region.dto';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region) // Region uchun Repositoryni injektsiya qilish
    private region: Repository<Region>,
  ) {}

  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }
  async create(data: CreateRegionDto) {
    let checkRegion = await this.region.findOne({ where: { name: data.name } });

    if (!checkRegion) {
      throw new BadRequestException('This region alredy exist');
    }

    let newRegion = await this.region.create(data);
    await this.region.save(newRegion);
    return { data: newRegion };
  }

  async findAll(query: GetRegionQueryDto) {
    try {
      const {
        page = 1,
        limit = 10,
        name = '',
        sort = 'id',
        order = 'ASC',
      } = query;

      const [data, total] = await this.region.findAndCount({
        where: name
          ? {
              name: ILike(`%${name}%`),
            }
          : {},
        order: {
          [sort]: order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });

      return {
        data,
        total,
        page: Number(page),
        lastPage: Math.ceil(total / Number(limit)),
      };
    } catch (error) {
      this.Error(error);
    }
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
