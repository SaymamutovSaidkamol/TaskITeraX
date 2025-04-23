
import { DataSource } from 'typeorm';
import { User } from './entities/user-entities';
import { Region } from './entities/region-entities';
import { Session } from './entities/session-entities';
import { Category } from './entities/category-entitiest';
import { Product } from './entities/product-entities';
import { Order } from './entities/order-entities';
import { OrderItem } from './entities/orderItem-entities';
import { Basket } from './entities/basket-entities';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: '3.72.45.215',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'iteraX',
  entities: [User, Region, Session, Category, Product, Order, OrderItem, Basket],
  synchronize: false, // true qilmaslik tavsiya etiladi ishlab chiqarish uchun
  logging: true,
});