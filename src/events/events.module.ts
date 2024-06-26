import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Event from './Schema/Event.entity';
import Ticket from 'src/tickets/Schema/ticket.entity';
import { AuthModule } from 'src/auth/auth.module';
import User from 'src/user/Schema/User.entity';
import { MailService } from 'src/mail/mail.service';
import { SubscribersService } from 'src/subscribers/subscribers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Ticket, User]), AuthModule],
  providers: [EventsService, MailService, SubscribersService],
  controllers: [EventsController],
})
export class EventsModule {}
