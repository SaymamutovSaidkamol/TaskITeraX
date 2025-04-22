import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from './user-entities';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  IpAdress: string;

  @Column('json')
  info: any;

  @Column()
  date: Date;

  @OneToMany(() => User, (user) => user.region)
  users: User[];
}
