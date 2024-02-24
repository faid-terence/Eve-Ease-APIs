import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Ticket from './Schema/ticket.entity';
import Event from 'src/events/Schema/Event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Event])],

  providers: [TicketsService, Ticket],
  controllers: [TicketsController],
})
export class TicketsModule {}