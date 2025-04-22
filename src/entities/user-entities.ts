import { Role, UserStatus } from 'src/Enums/enums';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Region } from './region-entities';
import { Session } from './session-entities';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  firstName: string;

  @Column('text')
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.INCACTIVE })
  status: UserStatus;

  @ManyToOne(() => Region, (region) => region.users)
  @JoinColumn({ name: 'regionId' })
  region: Region;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
}
