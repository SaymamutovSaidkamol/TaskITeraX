import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Basket } from 'src/entities/basket-entities';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user-entities';
import { Product } from 'src/entities/product-entities';
import { Request } from 'express';

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(Basket)
    private basket: Repository<Basket>,
    @InjectRepository(User)
    private user: Repository<User>,
    @InjectRepository(Product)
    private prod: Repository<Product>,
  ) {}

  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }

  async create(data: CreateBasketDto, req: Request) {
    try {
      let checkUser = await this.user.findOne({
        where: { id: req['user'].userId },
      });

      if (!checkUser) {
        throw new NotFoundException('User not found');
      }

      let checkProd = await this.prod.findOne({
        where: { id: data.productId },
      });

      if (!checkProd) {
        throw new BadRequestException('Product not found');
      }

      let newBasket = await this.basket.create({
        ...data,
        user: req['user'].userId,
        product: checkProd!,
      });
      await this.basket.save(newBasket);

      return { data: newBasket };
    } catch (error) {
      this.Error(error);
    }
  }

  async findAll(req: Request) {
    try {
      let checkUser = await this.user.findOne({
        where: { id: req['user'].userId },
      });

      if (!checkUser) {
        throw new NotFoundException('User not found');
      }

      let allbasket = await this.basket.find({
        where: { user: { id: req['user'].userId } },
        relations: ['user', 'product'],
      });

      return { data: allbasket };
    } catch (error) {
      this.Error(error);
    }
  }

  async update(id: number, data: UpdateBasketDto, req: Request) {
    try {
      let checkUser = await this.user.findOne({
        where: { id: req['user'].userId },
      });

      if (!checkUser) {
        throw new NotFoundException('User not found');
      }

      let checkBasket = await this.basket.findOne({
        where: { id }, relations: ['user']
      });

      if (!checkBasket) {
        throw new NotFoundException('Basket not found');
      }

      console.log(checkBasket);
      
      if (req['user'].userId != checkBasket.user.id) {
        throw new BadRequestException("You can't change others Basket");
      }

      if (data.productId) {
        let checkProd = await this.prod.findOne({
          where: { id: data.productId },
        });

        if (!checkProd) {
          throw new NotFoundException('Product not found');
        }
        checkBasket.product = checkProd;
      }

      await this.basket.save(checkBasket);

      return { message: 'basket changet saccessfully', data: checkBasket };
    } catch (error) {
      this.Error(error);
    }
  }

  async remove(id: number, req: Request) {
    try {
      let checkUser = await this.user.findOne({
        where: { id: req['user'].userId },
      });

      if (!checkUser) {
        throw new NotFoundException('User not found');
      }

      let checkBasket = await this.basket.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!checkBasket) {
        throw new NotFoundException('Basket not found');
      }

      console.log(checkBasket);

      if (req['user'].userId != checkBasket.user.id) {
        throw new BadRequestException("You can't change others Basket");
      }

      await this.basket.delete(id);

      return { message: 'Basket deleted successfully', data: checkBasket };
    } catch (error) {
      this.Error(error);
    }
  }

  async clear(req: Request) {
    try {
      const userId = req['user']?.userId;
      if (!userId) {
        throw new BadRequestException('Invalid user id');
      }
      const checkUser = await this.user.findOne({
        where: { id: userId },
      });
      if (!checkUser) {
        throw new NotFoundException('User not found');
      }
      const checkBasket = await this.basket.find({
        where: { user: userId },
      });
      if (!checkBasket || checkBasket.length === 0) {
        throw new NotFoundException('No baskets found for this user');
      }
      await this.basket.remove(checkBasket);
      return { message: 'All baskets cleared successfully.' };
    } catch (error) {
      console.log(error);
      this.Error(error);
    }
  }
}
