import {
  BadGatewayException,
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category-entitiest';
import { ILike, Repository } from 'typeorm';
import { GetCategoryQueryDto } from './dto/query-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categ: Repository<Category>,
  ) {}

  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }

  async create(data: CreateCategoryDto) {
    try {
      let checkCateg = await this.categ.findOne({ where: { name: data.name } });

      if (checkCateg) {
        throw new BadGatewayException('This category alredy exist');
      }

      let newCateg = await this.categ.create(data);
      await this.categ.save(newCateg);
      return { data: newCateg };
    } catch (error) {
      this.Error(error);
    }
  }

  async findAll(query: GetCategoryQueryDto) {
    try {
      const { page = 1, limit = 10, name = '', sort = 'id', order = 'ASC' } = query;

      const [data, total] = await this.categ.findAndCount({
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

  async findOne(id: number) {
    try {
      let checkCateg = await this.categ.findBy({ id });

      if (!checkCateg) {
        throw new NotFoundException('Category not found');
      }

      return { data: checkCateg };
    } catch (error) {
      this.Error(error);
    }
  }

  async update(id: number, data: UpdateCategoryDto) {
    try {
      let checkCateg = await this.categ.findOne({ where: { id } });

      if (!checkCateg) {
        throw new NotFoundException('Category not found');
      }

      if (data.name) {
        checkCateg.name = data.name;

        let checKName = await this.categ.findOne({
          where: { name: data.name },
        });

        if (checKName) {
          throw new BadGatewayException('This category alredy exist');
        }
      }

      if (data.description) {
        checkCateg.description = data.description;
      }

      if (data.img) {
        checkCateg.img = data.img;
      }

      const updateCateg = await this.categ.save(checkCateg);

      return { data: updateCateg };
    } catch (error) {
      this.Error(error);
    }
  }

  async remove(id: number) {
    try {
      let checkCateg = await this.categ.findOne({ where: { id } });

      if (!checkCateg) {
        throw new NotFoundException('Category not found');
      }

      await this.categ.delete({ id });

      return { data: checkCateg };
    } catch (error) {
      this.Error(error);
    }
  }
}
