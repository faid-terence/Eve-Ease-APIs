import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Ticket from './Schema/ticket.entity';
import Event from 'src/events/Schema/Event.entity';
import { MailService } from 'src/mail/mail.service';
import { AuthModule } from 'src/auth/auth.module';
import User from 'src/user/Schema/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Event, User]), AuthModule],

  providers: [TicketsService, Ticket, MailService],
  controllers: [TicketsController],
})
export class TicketsModule {}
