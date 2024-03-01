import { Module } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { SubscribersController } from './subscribers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/user/Schema/User.entity';
import Event from 'src/events/Schema/Event.entity';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Event])],
  providers: [SubscribersService, MailService],
  controllers: [SubscribersController],
})
export class SubscribersModule {}
