import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from './user-entities';
import { Product } from './product-entities';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  img: string;

  @OneToMany(() => Product, product => product.category)
  products: Product[];
}
