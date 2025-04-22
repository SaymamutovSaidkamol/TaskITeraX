import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user-entities';
import { UsersModule } from './users/users.module';
import { RegionModule } from './region/region.module';
import { Region } from './entities/region-entities';
import { MailModule } from './mail/mail.module';
import { Session } from './entities/session-entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'ITeraX',
      entities: [User, Region, Session],
      synchronize: true,
    }),
    UsersModule,
    RegionModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
