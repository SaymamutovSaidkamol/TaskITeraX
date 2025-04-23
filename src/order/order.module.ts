import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order-entities';
import { OrderItem } from 'src/entities/orderItem-entities';
import { User } from 'src/entities/user-entities';
import { Product } from 'src/entities/product-entities';
import { Basket } from 'src/entities/basket-entities';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, User, Product, Basket])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
