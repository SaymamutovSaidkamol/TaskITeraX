import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user-entities';
import { MailModule } from 'src/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { EskizService } from 'src/eskiz/eskiz.service';
import { Region } from 'src/entities/region-entities';
import { Session } from 'src/entities/session-entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Region, Session]),
    JwtModule.register({ global: true }),
    MailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, EskizService],
  exports: [JwtModule],
})
export class UsersModule {}
