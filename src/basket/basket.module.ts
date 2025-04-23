import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Basket } from 'src/entities/basket-entities';
import { User } from 'src/entities/user-entities';
import { Product } from 'src/entities/product-entities';

@Module({
  imports: [TypeOrmModule.forFeature([Basket, User, Product])],
  controllers: [BasketController],
  providers: [BasketService],
})
export class BasketModule {}
