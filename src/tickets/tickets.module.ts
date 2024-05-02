import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Ticket from './Schema/ticket.entity';
import Event from 'src/events/Schema/Event.entity';
import { MailModule } from 'src/mail/mail.module';
import User from 'src/user/Schema/User.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MailService } from 'src/mail/mail.service';
import { SubscribersService } from 'src/subscribers/subscribers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Event, User]), AuthModule],
  providers: [TicketsService, MailService],
  controllers: [TicketsController],
  exports: [TicketsService],
})
export class TicketsModule {}
