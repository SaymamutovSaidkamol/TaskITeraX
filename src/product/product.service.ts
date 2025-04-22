import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/entities/category-entitiest';
import { Product } from 'src/entities/product-entities';
import { GetProductQueryDto } from './dto/query-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private prod: Repository<Product>,
    @InjectRepository(Category)
    private categ: Repository<Category>,
  ) {}

  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }

  async create(data: CreateProductDto) {
    try {
      let checkCateg = await this.categ.findOne({
        where: { id: data.category },
      });

      if (!checkCateg) {
        throw new NotFoundException('Category not found');
      }

      let newProd = await this.prod.create({ ...data, category: checkCateg });
      await this.prod.save(newProd);

      return { message: 'Product added successfully', data: newProd };
    } catch (error) {
      this.Error(error);
    }
  }

  // async findAll() {
  //   try {
  //     let prod = await this.prod.find({ relations: ['category'] });

  //     return { data: prod };
  //   } catch (error) {
  //     this.Error(error);
  //   }
  // }
  async findAll(query: GetProductQueryDto) {
    const {
      name,
      price,
      stock,
      category,
      page = '1',
      limit = '10',
      sort = 'name',
      order = 'desc',
    } = query;
  
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
  
    const qb = this.prod.createQueryBuilder('product');
  
    // CATEGORY ni JOIN qilish
    qb.leftJoinAndSelect('product.category', 'category');
  
    if (name) {
      qb.andWhere('product.name ILIKE :name', { name: `%${name}%` });
    }
  
    if (price) {
      qb.andWhere('product.price >= :price', { price: Number(price) });
    }
  
    if (stock) {
      qb.andWhere('product.stock >= :stock', { stock: Number(stock) });
    }
  
    if (category) {
      qb.andWhere('product.categoryId = :category', { category: Number(category) });
    }
  
    qb.orderBy(`product.${sort}`, order.toUpperCase() as 'ASC' | 'DESC');
    qb.skip(skip).take(take);
  
    const [data, total] = await qb.getManyAndCount();
  
    return {
      data,
      total,
      page: Number(page),
      lastPage: Math.ceil(total / take),
    };
  }

  async findOne(id: number) {
    try {
      let chechProd = await this.prod.findOne({
        where: { id },
        relations: ['category'],
      });

      if (!chechProd) {
        throw new NotFoundException('Product not found');
      }

      return { data: chechProd };
    } catch (error) {
      this.Error(error);
    }
  }

  async update(id: number, data: UpdateProductDto) {
    try {
      let chechProd = await this.prod.findOne({
        where: { id },
        relations: ['category'],
      });

      if (!chechProd) {
        throw new NotFoundException('Product not found');
      }

      if (data.name) {
        chechProd.name = data.name;
      }

      if (data.description) {
        chechProd.description = data.description;
      }

      if (data.price) {
        chechProd.price = data.price;
      }

      if (data.stock) {
        chechProd.stock = data.stock;
      }

      if (data.img) {
        chechProd.img = data.img;
      }

      await this.prod.save(chechProd);

      return { message: 'Product updated successfully', data: chechProd };
    } catch (error) {
      this.Error(error);
    }
  }

  async remove(id: number) {
    try {
      let chechProd = await this.prod.findOne({
        where: { id },
        relations: ['category'],
      });

      if (!chechProd) {
        throw new NotFoundException('Product not found');
      }

      await this.prod.delete({ id });

      return chechProd;
    } catch (error) {
      this.Error(error);
    }
  }
}
