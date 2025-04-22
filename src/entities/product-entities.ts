import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from './user-entities';
import { Category } from './category-entitiest';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number

  @Column()
  stock: number

  @ManyToOne(() => Category, category => category.products, { onDelete: 'CASCADE' })
  category: Category;

  @Column()
  img: string;
}
