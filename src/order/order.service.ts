import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from 'src/entities/orderItem-entities';
import { Repository } from 'typeorm';
import { Order } from 'src/entities/order-entities';
import { User } from 'src/entities/user-entities';
import { Role, UserStatus } from 'src/Enums/enums';
import { GetOrderQueryDto } from './dto/query-order.dto';
import { Product } from 'src/entities/product-entities';
import { Basket } from 'src/entities/basket-entities';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItem: Repository<OrderItem>,
    @InjectRepository(Order)
    private order: Repository<Order>,
    @InjectRepository(User)
    private user: Repository<User>,
    @InjectRepository(Product)
    private prod: Repository<Product>,
    @InjectRepository(Basket)
    private basket: Repository<Basket>,
  ) {}
  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }
  async create(data: CreateOrderDto, req: Request) {
    try {
      let checkUser = await this.user.findOne({
        where: { id: req['user'].userId },
      });

      if (!checkUser) {
        throw new NotFoundException('User not found');
      }

      if (checkUser.status != UserStatus.ACTIVE) {
        throw new BadRequestException('Please activate your account');
      }

      let newOrder = await this.order.create({
        user: req['user'].userId,
        status: data.status,
      });
      await this.order.save(newOrder);

      let { OrderItem } = data;

      const items: OrderItem[] = [];

      for (const item of data.OrderItem) {
        const checkProd = await this.prod.findOne({
          where: { id: item.productId },
        });

        if (!checkProd) {
          throw new NotFoundException(
            `Product with id ${item.productId} not found`,
          );
        }

        const orderItem = this.orderItem.create({
          product: { id: item.productId },
          quantity: item.quantity || 1,
          order: newOrder,
        });

        items.push(orderItem);
      }

      await this.orderItem.save(items);
      let Checkbasket = await this.basket.find({
        where: { user: req['user'].userId },
      });

      await this.basket.remove(Checkbasket);

      return {
        message: 'Order created successfully',
        data: newOrder
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async findAll(query: GetOrderQueryDto, req: Request) {
    try {
      const page = query.page ? parseInt(query.page) : 1;
      const limit = query.limit ? parseInt(query.limit) : 10;
      const skip = (page - 1) * limit;

      const qb = this.order
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.user', 'user')
        .leftJoinAndSelect('order.orderItems', 'orderItems')
        .leftJoinAndSelect('orderItems.product', 'product');

      if (query.user) {
        qb.andWhere('order.userId = :userId', { userId: query.user });
      }

      if (query.status) {
        qb.andWhere('order.status = :status', { status: query.status });
      }

      if (query.sort === 'user') {
        qb.orderBy('order.user', query.order?.toUpperCase() as 'ASC' | 'DESC');
      } else if (query.sort === 'status') {
        qb.orderBy(
          'order.status',
          query.order?.toUpperCase() as 'ASC' | 'DESC',
        );
      }

      qb.skip(skip).take(limit);

      const [orders, total] = await qb.getManyAndCount();

      return {
        data: orders,
        page,
        limit,
        total,
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async findOne(id: number, req: Request) {
    try {
      let checkUser = await this.user.findOne({
        where: { id: req['user'].userId },
      });

      console.log(checkUser);

      if (!checkUser) {
        throw new BadRequestException('User not found');
      }

      if (checkUser.status != UserStatus.ACTIVE) {
        throw new BadRequestException('Please activate your account');
      }

      let checkOrder = await this.order.findOne({
        where: { id, user: req['user'].userId },
        relations: ['orderItems.product', 'user'],
      });

      console.log(checkOrder);

      if (!checkOrder) {
        throw new BadRequestException('Order not found');
      }
      if (
        req['user'].userId != checkOrder.user.id &&
        req['user'].role != Role.ADMIN
      ) {
        throw new BadRequestException(
          "Sorry, you cannot view other people's information.",
        );
      }

      return { data: checkOrder };
    } catch (error) {
      this.Error(error);
    }
  }

  async findOneByUser(req: Request) {
    try {
      const checkUser = await this.user.findOne({
        where: { id: req['user'].userId },
      });

      if (!checkUser) {
        throw new BadRequestException('User not found');
      }

      const userOrders = await this.order.find({
        where: { user: {id: req['user'].userId} },
        relations: ['orderItems', 'orderItems.product', 'user'],
      });

      console.log(userOrders);
      

      if (!userOrders.length) {
        throw new NotFoundException("User's orders are not found");
      }

      return { data: userOrders };
    } catch (error) {
      this.Error(error);
    }
  }
}
